import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as registryApi from '@/data/api/ai/registry.api';
import { useGetRegistries } from './useGetRegistries.hook';
import { mockedRegistry } from '@/__tests__/helpers/mocks/registry';

vi.mock('@/data/api/ai/registry.api', () => ({
  getRegistries: vi.fn(),
}));

describe('useGetRegistries', () => {
  it('should return Registries', async () => {
    const projectId = 'projectId';

    vi.mocked(registryApi.getRegistries).mockResolvedValue([mockedRegistry]);

    const { result } = renderHook(() => useGetRegistries(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedRegistry]);
      expect(registryApi.getRegistries).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
