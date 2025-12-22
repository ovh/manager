import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { useDeleteSwiftObject } from './useDeleteSwiftObject.hook';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  deleteSwiftObject: vi.fn(),
}));

describe('useDeleteSwiftObject', () => {
  it('should call useDeleteSwiftObject on mutation with data', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useDeleteSwiftObject({ onDeleteSuccess, onError }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteSwiftObject({
      storageName: 'myStorage',
      objectName: 'myObject',
      token: 'myAuthToken',
      url: 'https://swift.example.com',
    });

    await waitFor(() => {
      expect(swiftStorageApi.deleteSwiftObject).toHaveBeenCalledWith({
        storageName: 'myStorage',
        objectName: 'myObject',
        token: 'myAuthToken',
        url: 'https://swift.example.com',
      });
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });
});
