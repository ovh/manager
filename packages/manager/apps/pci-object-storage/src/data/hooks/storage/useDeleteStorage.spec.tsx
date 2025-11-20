import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useDeleteStorage } from './useDeleteStorage.hook';
import { ObjectStorageTypeEnum } from '@/types/Storages';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  deleteSwiftStorage: vi.fn(),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Storage: vi.fn(),
}));

describe('useDeleteStorage', () => {
  it('should call useDeleteStorage with Swidft on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();
    const storageType = ObjectStorageTypeEnum.swift;

    const { result } = renderHook(
      () => useDeleteStorage({ storageType, onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteStorage({
      projectId: 'projectId',
      containerId: 'containerId',
    });

    await waitFor(() => {
      expect(swiftStorageApi.deleteSwiftStorage).toHaveBeenCalledWith({
        projectId: 'projectId',
        containerId: 'containerId',
      });
      expect(onDeleteSuccess).toHaveBeenCalledWith();
    });
  });

  it('should call useDeleteStorage with s3 on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();
    const storageType = ObjectStorageTypeEnum.s3;

    const { result } = renderHook(
      () => useDeleteStorage({ storageType, onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteStorage({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
    });

    await waitFor(() => {
      expect(s3StorageApi.deleteS3Storage).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
      });
      expect(onDeleteSuccess).toHaveBeenCalledWith();
    });
  });
});
