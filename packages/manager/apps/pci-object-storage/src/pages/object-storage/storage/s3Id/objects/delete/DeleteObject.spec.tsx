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
  setMockedSearchParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import DeleteObjectModal from './DeleteObject.modal';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Object: vi.fn(),
}));

describe('Delete S3 Object', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
    setMockedSearchParams({
      objectKey: 'test-object.txt',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete Object Modal', async () => {
    render(<DeleteObjectModal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('delete-object-modal')).toBeTruthy();
    expect(screen.getByTestId('delete-object-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.deleteS3Object).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<DeleteObjectModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-object-submit-button'));
    });
    await waitFor(() => {
      expect(s3StorageAPI.deleteS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteObjectModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-object-submit-button'));
    });
    await waitFor(() => {
      expect(s3StorageAPI.deleteS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'deleteObjectToastSuccessDescription',
      });
    });
  });
});
