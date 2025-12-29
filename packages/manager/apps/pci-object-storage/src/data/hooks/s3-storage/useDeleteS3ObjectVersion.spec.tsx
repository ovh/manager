import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useDeleteS3ObjectVersion } from './useDeleteS3ObjectVersion.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  deleteS3ObjectVersion: vi.fn(),
}));

describe('useDeleteS3ObjectVersion', () => {
  it('should call useDeleteS3ObjectVersion on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useDeleteS3ObjectVersion({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteS3ObjectVersion({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      key: 'objectKey',
      versionId: 'versionId',
    });

    await waitFor(() => {
      expect(s3StorageApi.deleteS3ObjectVersion).toHaveBeenCalledWith({
        projectId: 'projectId',
        name: 's3Name',
        region: 'BHS',
        key: 'objectKey',
        versionId: 'versionId',
      });
      expect(onDeleteSuccess).toHaveBeenCalledWith();
    });
  });
});
