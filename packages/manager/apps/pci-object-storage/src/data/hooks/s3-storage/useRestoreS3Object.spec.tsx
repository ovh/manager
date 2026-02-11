import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useRestoreS3Object } from './useRestoreS3Object.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  restoreS3Object: vi.fn(),
}));

describe('useRestoreS3Object', () => {
  it('should call useRestoreS3Object on mutation with data', async () => {
    const onRestoreSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.restoreS3Object).mockResolvedValue({});
    const { result } = renderHook(
      () => useRestoreS3Object({ onError, onRestoreSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.restoreS3Object({
      projectId: 'projectId',
      region: 'BHS',
      name: 's3Name',
      key: 'objectKey',
      days: 7,
    });

    await waitFor(() => {
      expect(s3StorageApi.restoreS3Object).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 's3Name',
        key: 'objectKey',
        days: 7,
      });
      expect(onRestoreSuccess).toHaveBeenCalled();
    });
  });
});
