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
import * as s3storageAPI from '@/data/api/storage/s3Storage.api';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteS3Modal from './DeleteS3.modal';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

vi.mock('@/data/hooks/s3-storage/useGetS3.hook', () => ({
  useGetS3: vi.fn(() => ({
    data: mockedStorageContainer,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Storage: vi.fn(),
}));

describe('Delete S3', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      storageId: 'storageId',
      region: 'region',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete S3 Modal', async () => {
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('delete-storage-modal')).toBeTruthy();
    expect(screen.getByTestId('delete-storage-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3storageAPI.deleteS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-storage-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });

    await waitFor(() => {
      expect(s3storageAPI.deleteS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'The provided data is invalid',
        title: 'deleteStorageToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-storage-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });

    await waitFor(() => {
      expect(s3storageAPI.deleteS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteStorageToastSuccessTitle',
        description: 'deleteStorageToastSuccessDescription',
      });
    });
  });
});
