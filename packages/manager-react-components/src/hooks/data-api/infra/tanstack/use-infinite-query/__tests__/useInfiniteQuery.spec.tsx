import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  QueryClient,
  useInfiniteQuery as tanstackUseInfiniteQuery,
} from '@tanstack/react-query';
import { getWrapper } from '../../../../__tests__/Test.utils';

// Import your hook
import { useInfiniteQuery } from '../useInfiniteQuery';

// Mock TanStack's useInfiniteQuery
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useInfiniteQuery: vi.fn(),
  };
});

// Define a simple mock result
const mockResult = {
  data: { pages: [], pageParams: [] },
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetching: false,
  isError: false,
  isLoading: false,
  isSuccess: true,
  isFetchingNextPage: false,
  status: 'success',
  error: null,
} as any;

describe('useInfiniteQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.clearAllMocks();
    (tanstackUseInfiniteQuery as any).mockReturnValue(mockResult);
  });

  it('forwards options to tanstack useInfiniteQuery', () => {
    const cacheKey = ['posts'];
    const fetchDataFn = vi.fn().mockResolvedValue({ data: [] });
    const initialPageParam = 1;
    const enabled = true;
    const options = {
      cacheKey,
      fetchDataFn,
      transformFn: vi.fn(),
      initialPageParam,
      enabled,
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    };

    renderHook(() => useInfiniteQuery(options), { wrapper: getWrapper() });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        initialPageParam,
        queryKey: cacheKey,
        retry: false,
        enabled,
        staleTime: Infinity,
      }),
    );
  });

  it('returns the result from tanstack useInfiniteQuery', () => {
    const { result } = renderHook(
      () =>
        useInfiniteQuery({
          cacheKey: ['test'],
          fetchDataFn: vi.fn(),
          transformFn: vi.fn(),
          initialPageParam: 1,
          getNextPageParam: vi.fn(),
        }),
      { wrapper: getWrapper() },
    );

    expect(result.current).toStrictEqual(mockResult);
  });

  it('handles error states from tanstack query', () => {
    const error = new Error('Network Error');
    (tanstackUseInfiniteQuery as any).mockReturnValue({
      ...mockResult,
      status: 'error',
      error,
    });

    const { result } = renderHook(
      () =>
        useInfiniteQuery({
          cacheKey: ['fail'],
          fetchDataFn: vi.fn(),
          transformFn: vi.fn(),
          initialPageParam: 1,
          getNextPageParam: vi.fn(),
        }),
      { wrapper: getWrapper() },
    );

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
  });
});
