import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { useUpdateS3 } from './useUpdateS3.hook';
import { mockedUpdateS3Data } from '@/__tests__/helpers/mocks/s3/updateS3';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  updateS3Storage: vi.fn(),
}));

describe('useUpdateS3', () => {
  it('should call useUpdateS3 on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.updateS3Storage).mockResolvedValue(
      mockedStorageContainer,
    );
    const { result } = renderHook(() => useUpdateS3({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.updateS3Storage({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
      data: mockedUpdateS3Data,
    });

    await waitFor(() => {
      expect(s3StorageApi.updateS3Storage).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
        data: mockedUpdateS3Data,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedStorageContainer);
    });
  });
});
