import { useQuery as tanstackUseQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockQueryResult } from '@/commons/tests-utils/Mock.utils';

import { getWrapper } from '../../../../__tests__/Test.utils';
import { useQuery } from '../useQuery';

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('useQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tanstackUseQuery).mockReturnValue(
      mockQueryResult as unknown as ReturnType<typeof tanstackUseQuery>,
    );
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
    expect(result.current).toMatchObject(mockQueryResult);
  });

  it('accepts generic types and returns typed result (smoke test)', () => {
    interface User {
      id: number;
      name: string;
    }
    const options = {
      cacheKey: ['user'],
      fetchDataFn: (): Promise<User> => Promise.resolve({ id: 1, name: 'Alice' }),
    };
    const { result } = renderHook(() => useQuery<User, string[], Error>(options), {
      wrapper: getWrapper(),
    });
    expect(result.current).toBeDefined();
    expect(result.current.data).toStrictEqual({});
  });

  it('handles error state from tanstack query', () => {
    const error = new Error('Failed to fetch');
    vi.mocked(tanstackUseQuery).mockReturnValue({
      ...mockQueryResult,
      status: 'error',
      isError: true,
      error,
      data: undefined,
    } as unknown as ReturnType<typeof tanstackUseQuery>);
    const options = { cacheKey: ['fail'], fetchDataFn: vi.fn() };
    const { result } = renderHook(() => useQuery(options), {
      wrapper: getWrapper(),
    });
    expect(result.current.status).toBe('error');
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
  });

  it('handles loading state', () => {
    vi.mocked(tanstackUseQuery).mockReturnValue({
      ...mockQueryResult,
      status: 'pending',
      data: undefined,
      error: null,
    } as unknown as ReturnType<typeof tanstackUseQuery>);
    const options = { cacheKey: ['loading'], fetchDataFn: vi.fn() };
    const { result } = renderHook(() => useQuery(options), {
      wrapper: getWrapper(),
    });
    expect(result.current.status).toBe('pending');
  });
});
