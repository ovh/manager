import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datasyncAPI from '@/data/api/ai/app/datasync/datasync.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume/volume';
import DataSync from './DataSync.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';
import {
  mockedApp,
  mockedAppSpec,
  mockedAppStatus,
} from '@/__tests__/helpers/mocks/app/app';

const mockedAppWithVol: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    volumes: [mockedDatastoreVolume],
  },
  status: {
    ...mockedAppStatus,
    state: ai.app.AppStateEnum.RUNNING,
    volumes: [
      {
        id: 'volumeId',
        mountPath: '/demo1',
        userVolumeId: 'userVolumeId',
      },
    ],
  },
};
describe('Data Sync', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();

    vi.mock('@/data/api/user/user.api', () => ({
      dataSync: vi.fn((sync) => sync),
    }));

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedAppWithVol,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/datasync/datasync.api', () => ({
      dataSync: vi.fn((sync) => sync),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: vi.fn(),
      };
    });

    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders DataSync modal', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    expect(screen.getByText('dataSyncMountPathAlertDescription')).toBeTruthy();
  });

  it('renders Datasync modal', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    expect(screen.getByText('dataSyncGlobalAlertDescription')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(datasyncAPI.dataSync).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(datasyncAPI.dataSync).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'containerToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(datasyncAPI.dataSync).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'containerToastSuccessTitle',
        description: 'dataSyncMountPathToastSuccessDescription',
      });
    });
  });

  it('change Datasync type and trigger onSuccess on summit click', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeTruthy();

    // Select Push option
    await handleSelectOption(
      'select-datasync-trigger',
      ai.volume.DataSyncEnum.push,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(datasyncAPI.dataSync).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'containerToastSuccessTitle',
        description: 'dataSyncGlobalToastSuccessDescription',
      });
    });
  });
});
