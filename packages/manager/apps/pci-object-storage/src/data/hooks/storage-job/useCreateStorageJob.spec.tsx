import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useCreateStorageJob } from './useCreateStorageJob.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  createStorageJob: vi.fn(),
}));

describe('useCreateStorageJob', () => {
  it('should call useCreateStorageJob on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.createStorageJob).mockResolvedValue({});
    const { result } = renderHook(
      () => useCreateStorageJob({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.createStorageJob({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
    });

    await waitFor(() => {
      expect(s3StorageApi.createStorageJob).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
