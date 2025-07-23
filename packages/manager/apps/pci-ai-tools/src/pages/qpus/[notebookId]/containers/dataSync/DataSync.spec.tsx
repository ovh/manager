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
import ai from '@/types/AI';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datasyncAPI from '@/data/api/ai/notebook/datasync/datasync.api';

import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume/volume';
import DataSync from './DataSync.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

const mockedNotebookWithVol: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    volumes: [mockedDatastoreVolume],
  },
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.RUNNING,
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

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebookWithVol,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/notebook/datasync/datasync.api', () => ({
      dataSync: vi.fn((sync) => sync),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: vi.fn(),
      };
    });
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

  it('renders Data sync modal', async () => {
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
