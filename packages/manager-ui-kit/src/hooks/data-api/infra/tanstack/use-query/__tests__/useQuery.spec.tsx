import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  QueryClient,
  useQuery as tanstackUseQuery,
} from '@tanstack/react-query';
import { getWrapper } from '../../../../__tests__/Test.utils';

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
  data: {},
  error: null,
  isError: false,
  isFetching: true,
  isLoading: true,
  isSuccess: true,
  status: 'success',
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

  it('forwards options to tanstack useQuery', () => {
    const cacheKey = ['user', 1];
    const fetchDataFn = vi.fn().mockResolvedValue({ id: 1, name: 'John' });
    const options = {
      cacheKey,
      fetchDataFn,
      enabled: true,
      refetchInterval: 100,
    };

    renderHook(() => useQuery(options), { wrapper: getWrapper() });

    expect(tanstackUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: cacheKey,
        enabled: true,
        refetchInterval: 100,
      }),
    );
  });

  it('returns the result from tanstack useQuery', () => {
    const options = { cacheKey: ['test'], fetchDataFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), {
      wrapper: getWrapper(),
    });

    expect(result.current).toStrictEqual(mockResult);
  });

  it('accepts generic types and returns typed result (smoke test)', () => {
    interface User {
      id: number;
      name: string;
    }

    const options = {
      cacheKey: ['user'],
      fetchDataFn: (): Promise<User> =>
        Promise.resolve({ id: 1, name: 'Alice' }),
    };

    const { result } = renderHook(
      () => useQuery<User, string[], Error>(options),
      {
        wrapper: getWrapper(),
      },
    );

    expect(result.current).toBeDefined();
    expect(result.current.data).toStrictEqual({});
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

    const options = { cacheKey: ['fail'], fetchDataFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), {
      wrapper: getWrapper(),
    });

    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
  });

  it('handles loading state', () => {
    (tanstackUseQuery as any).mockReturnValue({
      ...mockResult,
      status: 'pending',
      data: undefined,
      error: null,
    });

    const options = { cacheKey: ['loading'], fetchDataFn: vi.fn() };

    const { result } = renderHook(() => useQuery(options), {
      wrapper: getWrapper(),
    });

    expect(result.current.status).toBe('pending');
  });
});
