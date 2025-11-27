import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useAddS3Object } from './useAddS3Object.hook';
import { mockedFile } from '@/__tests__/helpers/mocks/file/file';
import storages from '@/types/Storages';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  addS3Object: vi.fn(),
}));

const mockedResponse: Response = new Response(
  JSON.stringify({ message: 'ok' }),
  {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  },
);

describe('useAddS3Object', () => {
  it('should call useAddS3Object on mutation with data', async () => {
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(s3StorageApi.addS3Object).mockResolvedValue(mockedResponse);
    const { result } = renderHook(
      () => useAddS3Object({ onError, onAddSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.addS3Object({
      url: '/mynewurl',
      file: mockedFile,
      method: storages.PresignedURLMethodEnum.GET,
      signedHeaders: {
        header1: 'header1',
      },
    });

    await waitFor(() => {
      expect(s3StorageApi.addS3Object).toHaveBeenCalledWith({
        url: '/mynewurl',
        file: mockedFile,
        method: storages.PresignedURLMethodEnum.GET,
        signedHeaders: {
          header1: 'header1',
        },
      });
      expect(onAddSuccess).toHaveBeenCalled();
    });
  });
});
