import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useBulkDeleteS3Objects } from './useBulkDeleteS3Objects.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  bulkDeleteS3Objects: vi.fn(),
}));

describe('useBulkDeleteS3Objects', () => {
  it('should call useBulkDeleteS3Objects on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.bulkDeleteS3Objects).mockResolvedValue({});
    const { result } = renderHook(
      () => useBulkDeleteS3Objects({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.bulkDeleteS3Objects({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
      objects: [{ key: 'objectKey', versionId: 'versionId' }],
    });

    await waitFor(() => {
      expect(s3StorageApi.bulkDeleteS3Objects).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
        objects: [{ key: 'objectKey', versionId: 'versionId' }],
      });
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });
});
