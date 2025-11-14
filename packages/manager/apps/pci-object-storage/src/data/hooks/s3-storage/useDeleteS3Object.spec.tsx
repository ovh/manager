import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useDeleteS3Object } from './useDeleteS3Object.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3Object: vi.fn(),
}));

describe('useDeleteS3Object', () => {
  it('should call useDeleteS3Object on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useDeleteS3Object({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteS3Object({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
    });

    await waitFor(() => {
      expect(s3StorageApi.deleteS3Object).toHaveBeenCalledWith({
        projectId: 'projectId',
        name: 's3Name',
        region: 'BHS',
        key: 'objectKey',
      });
      expect(onDeleteSuccess).toHaveBeenCalledWith();
    });
  });
});
