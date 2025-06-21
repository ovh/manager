import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getUserPermissions } from '@/data/api/policies/user.api';
import useUserInfos from './useUserInfos';

vi.mock('@/data/api/policies/user.api', () => ({
  getUserPermissions: vi.fn(),
}));

type WrapperProps = { children: React.ReactNode };
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const wrapper = ({ children }: WrapperProps) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useUserInfos hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when matching permission exists', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-project-1',
      'ai-endpoints-user-other',
    ]);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(getUserPermissions).toHaveBeenCalledTimes(1);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should return false when no matching permission', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-other',
    ]);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(getUserPermissions).toHaveBeenCalledTimes(1);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should set isError when getUserPermissions throws', async () => {
    const error = new Error('API failure');
    vi.mocked(getUserPermissions).mockRejectedValue(error);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(getUserPermissions).toHaveBeenCalledTimes(1);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch when no projectId is provided', () => {
    const { result } = renderHook(() => useUserInfos(undefined), { wrapper });

    expect(getUserPermissions).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });
});
