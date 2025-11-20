import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useUpdateS3ObjectStorageClass } from './useUpdateS3ObjectStorageClass.hook';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import storages from '@/types/Storages';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  updateS3ObjectStorageClass: vi.fn(),
}));

describe('useUpdateS3ObjectStorageClass', () => {
  it('should call useUpdateS3ObjectStorageClass on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.updateS3ObjectStorageClass).mockResolvedValue(
      mockedS3Object,
    );
    const { result } = renderHook(
      () => useUpdateS3ObjectStorageClass({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.updateObjectStorageClass({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
      key: 'objectKey',
      storageClass: storages.StorageClassEnum.STANDARD,
      versionId: 'versionId',
    });

    await waitFor(() => {
      expect(s3StorageApi.updateS3ObjectStorageClass).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
        key: 'objectKey',
        storageClass: storages.StorageClassEnum.STANDARD,
        versionId: 'versionId',
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedS3Object);
    });
  });
});
