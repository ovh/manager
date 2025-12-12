import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import { useGetS3Objects } from './useGetS3Objects.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Objects: vi.fn(),
}));

describe('useGetS3Objects', () => {
  it('should call useGetS3Objects on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'BHS';
    const name = 's3Name';

    vi.mocked(s3StorageApi.getS3Objects).mockResolvedValue([mockedS3Object]);
    const { result } = renderHook(
      () => useGetS3Objects({ projectId, region, name }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedS3Object]);
      expect(s3StorageApi.getS3Objects).toHaveBeenCalledWith({
        projectId,
        region,
        name,
      });
    });
  });
});
