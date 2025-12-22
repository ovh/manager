import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { mockedFile } from '@/__tests__/helpers/mocks/file/file';
import { useAddSwiftObject } from './useAddSwiftObject.hook';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  addSwiftObject: vi.fn(),
}));

const mockedResponse: Response = new Response(
  JSON.stringify({ message: 'ok' }),
  {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  },
);

describe('useAddSwiftObject', () => {
  it('should call useAddSwiftObject on mutation with data', async () => {
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(swiftStorageApi.addSwiftObject).mockResolvedValue(mockedResponse);
    const { result } = renderHook(
      () => useAddSwiftObject({ onError, onAddSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.addSwiftObject({
      url: '/mynewurl',
      file: mockedFile,
      token: 'myToken',
    });

    await waitFor(() => {
      expect(swiftStorageApi.addSwiftObject).toHaveBeenCalledWith({
        url: '/mynewurl',
        file: mockedFile,
        token: 'myToken',
      });
      expect(onAddSuccess).toHaveBeenCalledWith();
    });
  });
});
