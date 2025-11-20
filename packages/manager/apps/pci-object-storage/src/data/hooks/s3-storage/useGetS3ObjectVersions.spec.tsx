import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import { useGetS3ObjectVersions } from './useGetS3ObjectVersions.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3ObjectVersions: vi.fn(),
}));

describe('useGetS3ObjectVersions', () => {
  it('should call useGetS3ObjectVersions on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'BHS';
    const name = 's3Name';
    const key = 'objectName';

    vi.mocked(s3StorageApi.getS3ObjectVersions).mockResolvedValue([
      mockedS3Object,
    ]);
    const { result } = renderHook(
      () => useGetS3ObjectVersions({ projectId, region, name, key }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedS3Object]);
      expect(s3StorageApi.getS3ObjectVersions).toHaveBeenCalledWith({
        projectId,
        region,
        name,
        key,
      });
    });
  });
});
