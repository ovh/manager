import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery as tanstackUseInfiniteQuery,
} from '@tanstack/react-query';

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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('forwards options to tanstack useInfiniteQuery', () => {
    const queryKey = ['posts'];
    const queryFn = vi.fn().mockResolvedValue({ data: [] });
    const options = {
      queryKey,
      queryFn,
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    };

    renderHook(() => useInfiniteQuery(options), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalledWith(options);
  });

  it('returns the result from tanstack useInfiniteQuery', () => {
    const { result } = renderHook(
      () =>
        useInfiniteQuery({
          queryKey: ['test'],
          queryFn: vi.fn(),
          initialPageParam: 1,
          getNextPageParam: vi.fn(),
        }),
      { wrapper },
    );

    expect(result.current).toBe(mockResult);
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
          queryKey: ['fail'],
          queryFn: vi.fn(),
          initialPageParam: 1,
          getNextPageParam: vi.fn(),
        }),
      { wrapper },
    );

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
  });
});
