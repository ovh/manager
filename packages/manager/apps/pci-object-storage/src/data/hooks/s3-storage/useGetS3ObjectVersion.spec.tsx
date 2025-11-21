import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import { useGetS3ObjectVersion } from './useGetS3ObjectVersion.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3ObjectVersion: vi.fn(),
}));

describe('useGetS3ObjectVerion', () => {
  it('should call useGetS3ObjectVerion on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'BHS';
    const name = 's3Name';
    const key = 'objectName';
    const versionId = 'versionId';

    vi.mocked(s3StorageApi.getS3ObjectVersion).mockResolvedValue(
      mockedS3Object,
    );
    const { result } = renderHook(
      () => useGetS3ObjectVersion({ projectId, region, name, key, versionId }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedS3Object);
      expect(s3StorageApi.getS3ObjectVersion).toHaveBeenCalledWith({
        projectId,
        region,
        name,
        key,
        versionId,
      });
    });
  });
});
