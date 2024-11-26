import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as storageApi from '@/data/api/storage/storage.api';
import { useGetStorage } from './useGetStorage.hook';
import { mockedStorage } from '@/__tests__/helpers/mocks/storage';

vi.mock('@/data/api/storage/storage.api', () => ({
  getStorage: vi.fn(),
}));

describe('useGetStorage', () => {
  it('should return storage', async () => {
    const projectId = 'projectId';

    vi.mocked(storageApi.getStorage).mockResolvedValue([mockedStorage]);

    const { result } = renderHook(() => useGetStorage(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedStorage]);
      expect(storageApi.getStorage).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
