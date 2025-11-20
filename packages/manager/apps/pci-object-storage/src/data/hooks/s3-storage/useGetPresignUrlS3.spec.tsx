import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import {
  mockedPresignUrl,
  mockedPresignUrlInput,
} from '@/__tests__/helpers/mocks/storageContainer/presignUrl';
import { useGetPresignUrlS3 } from './useGetPresignUrlS3.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getPresignUrlS3: vi.fn(),
}));

describe('useGetPresignUrlS3', () => {
  it('should call useGetPresignUrlS3 on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.getPresignUrlS3).mockResolvedValue(mockedPresignUrl);
    const { result } = renderHook(
      () => useGetPresignUrlS3({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.getPresignUrlS3({
      projectId: 'projectId',
      region: 'BHS',
      name: 'containerName',
      data: mockedPresignUrlInput,
    });

    await waitFor(() => {
      expect(s3StorageApi.getPresignUrlS3).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'BHS',
        name: 'containerName',
        data: mockedPresignUrlInput,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedPresignUrl, undefined);
    });
  });
});
