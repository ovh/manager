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
import * as ai from '@/types/cloud/project/ai';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datasyncAPI from '@/data/api/ai/notebook/datasync/datasync.api';
import { useToast } from '@/components/ui/use-toast';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume';
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
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncMountPathAlertDescription'),
    ).toBeInTheDocument();
  });

  it('renders Data sync modal', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    expect(
      screen.getByText('dataSyncGlobalAlertDescription'),
    ).toBeInTheDocument();
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
        title: 'dataSyncToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('datasync-submit-button'));
    });
    await waitFor(() => {
      expect(datasyncAPI.dataSync).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'dataSyncToastSuccessTitle',
        description: 'dataSyncMountPathToastSuccessDescription',
      });
    });
  });

  it('change Datasync type and trigger onSuccess on summit click', async () => {
    vi.mocked(useParams).mockReturnValue({});
    render(<DataSync />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('datasync-modal')).toBeInTheDocument();

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
        title: 'dataSyncToastSuccessTitle',
        description: 'dataSyncGlobalToastSuccessDescription',
      });
    });
  });
});
