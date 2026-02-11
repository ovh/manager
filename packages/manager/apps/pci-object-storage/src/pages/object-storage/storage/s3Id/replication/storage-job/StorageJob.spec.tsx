import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as s3StorageAPI from '@/data/api/storage/s3Storage.api';
import { mockedS3WithReplication } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import StorageJobModal from './StorageJob.modal';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedS3WithReplication,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  createStorageJob: vi.fn(),
}));

describe('Create Storage Job', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Storage Job Modal', async () => {
    render(<StorageJobModal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('storage-job-modal')).toBeTruthy();
    expect(screen.getByTestId('storage-job-confirm-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.createStorageJob).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<StorageJobModal />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('storage-job-confirm-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.createStorageJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'storageJobToastErrorTitle',
        description: 'storageJobToastErrorMessage',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<StorageJobModal />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('storage-job-confirm-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.createStorageJob).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'storageJobToastSuccessTitle',
        description: 'storageJobToastSuccessMessage',
      });
    });
  });
});
