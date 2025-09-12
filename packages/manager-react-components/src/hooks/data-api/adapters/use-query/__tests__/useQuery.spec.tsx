import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery as tanstackUseQuery,
} from '@tanstack/react-query';

import { useQuery } from '../useQuery';

// Mock TanStack's useQuery
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

// Define a simple mock result
const mockResult = {
  data: undefined,
  error: null,
  isError: false,
  isPending: false,
  isSuccess: true,
  status: 'success',
  refetch: vi.fn(),
} as any;

describe('useQuery', () => {
  let queryClient: QueryClient;
  let altQueryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    altQueryClient = new QueryClient();

    vi.clearAllMocks();
    (tanstackUseQuery as any).mockReturnValue(mockResult);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('forwards options to tanstack useQuery', () => {
    const queryKey = ['user', 1];
    const queryFn = vi.fn().mockResolvedValue({ id: 1, name: 'John' });
    const options = { queryKey, queryFn };

    renderHook(() => useQuery(options), { wrapper });

    expect(tanstackUseQuery).toHaveBeenCalledWith(options, undefined);
  });

  it('forwards queryClient if provided', () => {
    const options = { queryKey: ['test'], queryFn: vi.fn() };

    renderHook(() => useQuery(options, altQueryClient), { wrapper });

    expect(tanstackUseQuery).toHaveBeenCalledWith(options, altQueryClient);
  });

  it('returns the result from tanstack useQuery', () => {
    const options = { queryKey: ['test'], queryFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), { wrapper });

    expect(result.current).toBe(mockResult);
  });

  it('accepts generic types and returns typed result (smoke test)', () => {
    interface User {
      id: number;
      name: string;
    }

    const options = {
      queryKey: ['user'],
      queryFn: (): Promise<User> => Promise.resolve({ id: 1, name: 'Alice' }),
    };

    const { result } = renderHook(() => useQuery<User, Error>(options), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('handles error state from tanstack query', () => {
    const error = new Error('Failed to fetch');
    (tanstackUseQuery as any).mockReturnValue({
      ...mockResult,
      status: 'error',
      isError: true,
      error,
      data: undefined,
    });

    const options = { queryKey: ['fail'], queryFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), { wrapper });

    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
  });

  it('handles loading state', () => {
    (tanstackUseQuery as any).mockReturnValue({
      ...mockResult,
      status: 'pending',
      isPending: true,
      data: undefined,
      error: null,
    });

    const options = { queryKey: ['loading'], queryFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), { wrapper });

    expect(result.current.status).toBe('pending');
    expect(result.current.isPending).toBe(true);
  });

  it('does not crash when no queryClient is passed (uses context)', () => {
    const options = { queryKey: ['safe'], queryFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), { wrapper });

    expect(tanstackUseQuery).toHaveBeenCalledWith(options, undefined);
    expect(result.current).toBeDefined();
  });
});
