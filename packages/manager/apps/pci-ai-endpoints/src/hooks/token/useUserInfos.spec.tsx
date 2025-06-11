import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getUserPermissions, getUserId } from '@/data/api/policies/user.api';
import useUserInfos from './useUserInfos';

vi.mock('@/data/api/policies/user.api', () => ({
  getUserPermissions: vi.fn(),
  getUserId: vi.fn(),
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

  it('returns true when permission exists and user is privileged', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-project-1',
      'ai-endpoints-user-other',
    ]);
    vi.mocked(getUserId).mockResolvedValue({ group: 'ADMIN' } as any);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(vi.mocked(getUserId)).toHaveBeenCalledWith('project-1');
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('returns false when permission is missing but user is privileged', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-other',
    ]);
    vi.mocked(getUserId).mockResolvedValue({ group: 'ADMIN' } as any);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(vi.mocked(getUserId)).toHaveBeenCalledWith('project-1');
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns false when permission exists but user is unprivileged', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-project-1',
    ]);
    vi.mocked(getUserId).mockResolvedValue({ group: 'UNPRIVILEGED' } as any);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(vi.mocked(getUserId)).toHaveBeenCalledWith('project-1');
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets isError=true when getUserPermissions throws', async () => {
    const permissionError = new Error('Permissions API error');
    vi.mocked(getUserPermissions).mockRejectedValue(permissionError);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(permissionError);
    expect(result.current.data).toBeUndefined();
  });

  it('sets isError=true when getUserId throws', async () => {
    vi.mocked(getUserPermissions).mockResolvedValue([
      'ai-endpoints-user-project-1',
    ]);
    const idError = new Error('User API error');
    vi.mocked(getUserId).mockRejectedValue(idError);

    const { result } = renderHook(() => useUserInfos('project-1'), { wrapper });

    await waitFor(() => {
      expect(vi.mocked(getUserPermissions)).toHaveBeenCalled();
      expect(vi.mocked(getUserId)).toHaveBeenCalledWith('project-1');
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(idError);
    expect(result.current.data).toBeUndefined();
  });

  it('does not run query when no projectId is provided', async () => {
    const { result } = renderHook(() => useUserInfos(undefined), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(vi.mocked(getUserPermissions)).not.toHaveBeenCalled();
    expect(vi.mocked(getUserId)).not.toHaveBeenCalled();
  });
});
