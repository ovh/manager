import { useInfiniteQuery as tanstackUseInfiniteQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockResult } from '@/commons/tests-utils/Mock.utils';
import { MockPage } from '@/commons/tests-utils/Type.utils';

import { getWrapper } from '../../../../__tests__/Test.utils';
import { useInfiniteQuery } from '../useInfiniteQuery';

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useInfiniteQuery: vi.fn(),
  };
});

describe('useInfiniteQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue(mockResult);
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
      getNextPageParam: (lastPage: MockPage) => lastPage?.nextCursor ?? null,
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

    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockResult,
      status: 'error',
      error,
      isError: true,
      isSuccess: false,
      isPending: false,
      isLoading: false,
      isRefetchError: true,
      data: undefined,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

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
