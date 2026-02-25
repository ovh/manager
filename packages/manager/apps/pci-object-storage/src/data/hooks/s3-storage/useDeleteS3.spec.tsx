import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useDeleteS3 } from './useDeleteS3.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Storage: vi.fn(),
}));

describe('useDeleteS3', () => {
  it('should call useDeleteS3 on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.deleteS3Storage).mockResolvedValue({});
    const { result } = renderHook(
      () => useDeleteS3({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteS3({
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
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });
});
