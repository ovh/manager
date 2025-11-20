import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useGetS3 } from './useGetS3.hook';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(),
}));

describe('useGetS3', () => {
  it('should call useGetS3 on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'BHS';
    const name = 's3Name';

    vi.mocked(s3StorageApi.getS3Storage).mockResolvedValue(
      mockedStorageContainer,
    );
    const { result } = renderHook(() => useGetS3({ projectId, region, name }), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedStorageContainer);
      expect(s3StorageApi.getS3Storage).toHaveBeenCalledWith({
        projectId,
        region,
        name,
      });
    });
  });
});
