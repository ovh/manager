import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import { useGetS3Object } from './useGetS3Object.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Object: vi.fn(),
}));

describe('useGetS3Object', () => {
  it('should call useGetS3Object on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'BHS';
    const name = 's3Name';
    const key = 'objectName';

    vi.mocked(s3StorageApi.getS3Object).mockResolvedValue(mockedS3Object);
    const { result } = renderHook(
      () => useGetS3Object({ projectId, region, name, key }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedS3Object);
      expect(s3StorageApi.getS3Object).toHaveBeenCalledWith({
        projectId,
        region,
        name,
        key,
      });
    });
  });
});
