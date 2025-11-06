import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as storagesApi from '@/data/api/storage/storages.api';
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { useGetStorages } from './useGetStorages.hook';

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorages: vi.fn(),
}));

describe('useGetStorages', () => {
  it('should call useGetStorages on mutation with data', async () => {
    const projectId = 'projectId';

    vi.mocked(storagesApi.getStorages).mockResolvedValue(mockedStorages);
    const { result } = renderHook(() => useGetStorages(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedStorages);
      expect(storagesApi.getStorages).toHaveBeenCalledWith({
        projectId,
        archive: false,
        withObjects: true,
      });
    });
  });
});
