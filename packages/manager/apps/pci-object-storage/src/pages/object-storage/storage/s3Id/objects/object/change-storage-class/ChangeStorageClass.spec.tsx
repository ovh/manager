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
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import {
  mockedUsedNavigate,
  setMockedUseParams,
  setMockedSearchParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import storages from '@/types/Storages';
import ChangeStorageClassModal from './ChangeStorageClass.modal';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/hooks/useAvailableStorageClasses.hook', () => ({
  useAvailableStorageClasses: vi.fn(() => ({
    availableStorageClasses: [
      storages.StorageClassEnum.STANDARD,
      storages.StorageClassEnum.STANDARD_IA,
      storages.StorageClassEnum.HIGH_PERF,
    ],
    isPending: false,
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Object: vi.fn(() => mockedS3Object),
  updateS3ObjectStorageClass: vi.fn(() => mockedS3Object),
}));

describe('Change Storage Class', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
    setMockedSearchParams({
      objectKey: 'objectKey',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Change Storage Class Modal', async () => {
    render(<ChangeStorageClassModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('change-storage-class-modal')).toBeTruthy();
      expect(
        screen.getByTestId('change-storage-class-submit-button'),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.updateS3ObjectStorageClass).mockImplementation(
      () => {
        throw mockedObjStoError;
      },
    );
    render(<ChangeStorageClassModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('change-storage-class-modal')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('radio-item-STANDARD_IA'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('change-storage-class-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.updateS3ObjectStorageClass).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<ChangeStorageClassModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('change-storage-class-modal')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('radio-item-STANDARD_IA'));
    });

    act(() => {
      fireEvent.click(screen.getByTestId('change-storage-class-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.updateS3ObjectStorageClass).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'changeStorageClassSuccessTitle',
        description: 'changeStorageClassSuccessDescription',
      });
    });
  });
});
