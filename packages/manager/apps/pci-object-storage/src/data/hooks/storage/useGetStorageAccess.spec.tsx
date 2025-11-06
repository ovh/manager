import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as storagesApi from '@/data/api/storage/storages.api';
import { useGetStorageAccess } from './useGetStorageAccess.hook';
import { mockedContainerAccess } from '@/__tests__/helpers/mocks/storageContainer/access';

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorageAccess: vi.fn(),
}));

describe('useGetStorageAccess', () => {
  it('should call useGetStorageAccess on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(storagesApi.getStorageAccess).mockResolvedValue(
      mockedContainerAccess,
    );
    const { result } = renderHook(
      () => useGetStorageAccess({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.getStorageAccess({
      projectId: 'projectId',
    });

    await waitFor(() => {
      expect(storagesApi.getStorageAccess).toHaveBeenCalledWith({
        projectId: 'projectId',
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedContainerAccess);
    });
  });
});
