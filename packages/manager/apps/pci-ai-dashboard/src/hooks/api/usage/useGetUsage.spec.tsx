import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/usage/usage.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetCurrentUsage } from './useGetUsage.hook';
import { mockedCurrentUsage } from '@/__tests__/helpers/mocks/currentUsage';

vi.mock('@/data/api/usage/usage.api', () => ({
  getCurrentUsage: vi.fn(),
}));

describe('useGetUsage', () => {
  it('should return GetUSage', async () => {
    vi.mocked(API.getCurrentUsage).mockResolvedValue(mockedCurrentUsage);
    const projectId = 'projectId';

    const { result } = renderHook(() => useGetCurrentUsage(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedCurrentUsage);
      expect(API.getCurrentUsage).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
