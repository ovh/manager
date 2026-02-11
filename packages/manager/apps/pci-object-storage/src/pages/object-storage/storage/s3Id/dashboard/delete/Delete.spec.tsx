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
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import DeleteS3Modal from './Delete.modal';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Storage: vi.fn(),
}));

describe('Delete S3 Storage', () => {
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

  it('renders Delete S3 Storage Modal', async () => {
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('delete-storage-modal')).toBeTruthy();
    expect(
      screen.getByTestId('delete-storage-confirmation-input'),
    ).toBeTruthy();
    expect(screen.getByTestId('delete-storage-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.deleteS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });

    const confirmationInput = screen.getByTestId(
      'delete-storage-confirmation-input',
    );
    act(() => {
      fireEvent.change(confirmationInput, {
        target: { value: TERMINATE_CONFIRMATION },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.deleteS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteStorageToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteS3Modal />, { wrapper: RouterWithQueryClientWrapper });

    const confirmationInput = screen.getByTestId(
      'delete-storage-confirmation-input',
    );
    act(() => {
      fireEvent.change(confirmationInput, {
        target: { value: TERMINATE_CONFIRMATION },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-storage-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.deleteS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteStorageToastSuccessTitle',
        description: 'deleteStorageToastSuccessDescription',
      });
    });
  });
});
