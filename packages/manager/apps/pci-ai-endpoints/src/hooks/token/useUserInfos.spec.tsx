import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getUserPermissions } from '@/data/api/policies/user.api';
import useUserInfos from './useUserInfos';

vi.mock('@/data/api/policies/user.api', () => ({
  getUserPermissions: vi.fn(),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useUserInfos hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should eventually have data=true when the project permission exists', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-project-1',
      'ai-endpoints-user-other',
    ]);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should eventually have data=false when the project permission is missing', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-other',
    ]);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should set isError=true when getUserPermissions throws', async () => {
    const error = new Error('API error');
    vi.mocked(getUserPermissions).mockRejectedValue(error);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });
});
