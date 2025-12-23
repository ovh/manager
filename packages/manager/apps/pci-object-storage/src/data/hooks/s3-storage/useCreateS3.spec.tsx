import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { useCreateS3 } from './useCreateS3.hook';
import { mockedCreateS3Data } from '@/__tests__/helpers/mocks/s3/createS3';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  createS3Storage: vi.fn(),
}));

describe('useCreateS3', () => {
  it('should call useCreateS3 on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.createS3Storage).mockResolvedValue(
      mockedStorageContainer,
    );
    const { result } = renderHook(() => useCreateS3({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.createS3({
      projectId: 'projectId',
      region: 'BHS',
      data: mockedCreateS3Data,
    });

    await waitFor(() => {
      expect(s3StorageApi.createS3Storage).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        data: mockedCreateS3Data,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedStorageContainer);
    });
  });
});
