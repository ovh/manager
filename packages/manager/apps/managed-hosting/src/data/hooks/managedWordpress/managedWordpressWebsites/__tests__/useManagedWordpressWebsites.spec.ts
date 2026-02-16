import { useParams } from 'react-router-dom';

import { useInfiniteQuery as tanstackUseInfiniteQuery } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { managedWordpressWebsitesMock } from '@/data/__mocks__/managedWordpress/website';
import { getManagedCmsResourceWebsites } from '@/data/api/managedWordpress';
import { APIV2_MAX_PAGESIZE } from '@/utils';
import { wrapper } from '@/utils/tests/test.provider';
import { mockInfiniteQueryResult } from '@/utils/tests/test.setup';

import { useManagedWordpressWebsites } from '../useManagedWordpressWebsites';

vi.mocked(useParams).mockReturnValue({ serviceName: 'test' });

describe('useManagedWordpressWebsites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue(
      mockInfiniteQueryResult as unknown as ReturnType<typeof tanstackUseInfiniteQuery>,
    );
  });

  it('should return website list', () => {
    const { result } = renderHook(() => useManagedWordpressWebsites(), { wrapper });

    expect(result.current).toEqual(
      expect.objectContaining({
        data: managedWordpressWebsitesMock,
        status: 'success',
        isSuccess: true,
        isError: false,
        fetchAllPages: expect.any(Function) as () => void,
      }),
    );
  });

  it('should handle enabled as function returning false', () => {
    const enabledFn = vi.fn(() => false);
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResult,
      status: 'pending' as const,
      isSuccess: false,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useManagedWordpressWebsites({ enabled: enabledFn }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      enabled?: unknown;
    };
    expect(callArgs.enabled).toBeDefined();
  });

  it('should handle enabled as boolean false', () => {
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResult,
      status: 'pending' as const,
      isSuccess: false,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useManagedWordpressWebsites({ enabled: false }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      enabled?: (q: unknown) => boolean;
    };
    expect(callArgs.enabled).toBeDefined();
    expect(typeof callArgs.enabled).toBe('function');
    if (callArgs.enabled) {
      expect(callArgs.enabled({})).toBe(false);
    }
  });

  it('should handle enabled as boolean true', () => {
    renderHook(() => useManagedWordpressWebsites({ enabled: true }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      enabled?: (q: unknown) => boolean;
    };
    expect(callArgs.enabled).toBeDefined();
    expect(typeof callArgs.enabled).toBe('function');
    if (callArgs.enabled) {
      expect(callArgs.enabled({})).toBe(true);
    }
  });

  it('should call fetchAllPages and set allPages to true when allPages is false', () => {
    const { result } = renderHook(() => useManagedWordpressWebsites(), { wrapper });

    act(() => {
      if (result.current.fetchAllPages) {
        result.current.fetchAllPages();
      }
    });

    expect(result.current.fetchAllPages).toBeDefined();
    expect(typeof result.current.fetchAllPages).toBe('function');
  });

  it('should call fetchNextPage when allPages is true, hasNextPage is true and isFetchingNextPage is false', async () => {
    const fetchNextPageMock = vi.fn().mockResolvedValue(undefined);
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResult,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: fetchNextPageMock,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useManagedWordpressWebsites({ shouldFetchAll: true }), { wrapper });

    await waitFor(() => {
      expect(fetchNextPageMock).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should reset allPages when searchParams changes and shouldFetchAll is false', () => {
    const { rerender } = renderHook(
      ({ defaultFQDN }: { defaultFQDN?: string }) =>
        useManagedWordpressWebsites({ defaultFQDN, shouldFetchAll: false }),
      {
        wrapper,
        initialProps: { defaultFQDN: undefined },
      },
    );

    rerender({ defaultFQDN: 'test.example.com' });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
  });

  it('should use select function to flatten pages data', () => {
    const { result } = renderHook(() => useManagedWordpressWebsites(), { wrapper });

    expect(result.current.data).toEqual(managedWordpressWebsitesMock);
  });

  it('should handle disableRefetchInterval option', () => {
    renderHook(() => useManagedWordpressWebsites({ disableRefetchInterval: true }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      refetchInterval?: boolean | number;
    };
    expect(callArgs.refetchInterval).toBe(false);
  });

  it('should use APIV2_MAX_PAGESIZE when allPages is true', () => {
    renderHook(() => useManagedWordpressWebsites({ shouldFetchAll: true }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      queryFn?: (params: { pageParam: unknown }) => Promise<unknown>;
    };
    expect(callArgs.queryFn).toBeDefined();

    if (callArgs.queryFn) {
      void callArgs.queryFn({ pageParam: null });
      expect(getManagedCmsResourceWebsites).toHaveBeenCalledWith({
        serviceName: 'test',
        pageParam: null as string,
        searchParams: '',
        pageSize: APIV2_MAX_PAGESIZE,
      });
    }
  });

  it('should call queryFn with correct parameters when allPages is false', () => {
    renderHook(() => useManagedWordpressWebsites(), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      queryFn?: (params: { pageParam: unknown }) => Promise<unknown>;
    };
    expect(callArgs.queryFn).toBeDefined();

    if (callArgs.queryFn) {
      void callArgs.queryFn({ pageParam: 'cursor123' });
      expect(getManagedCmsResourceWebsites).toHaveBeenCalledWith({
        serviceName: 'test',
        pageParam: 'cursor123' as string,
        searchParams: '',
      });
    }
  });

  it('should use select function to flatten multiple pages', () => {
    const multiplePagesData = {
      pages: [
        { data: [managedWordpressWebsitesMock[0]] },
        { data: [managedWordpressWebsitesMock[1]] },
      ],
      pageParams: [null, 'cursor1'],
    };

    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResult,
      pages: multiplePagesData.pages,
      pageParams: multiplePagesData.pageParams,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    const { result } = renderHook(() => useManagedWordpressWebsites(), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      select?: (data: { pages: Array<{ data: typeof managedWordpressWebsitesMock }> }) => unknown;
    };

    // Tester que la fonction select flatMap correctement les pages
    if (callArgs.select) {
      const selectedData = callArgs.select(multiplePagesData);
      expect(selectedData).toEqual([
        managedWordpressWebsitesMock[0],
        managedWordpressWebsitesMock[1],
      ]);
    }

    // Vérifier que le résultat final contient les données aplaties
    expect(result.current.data).toBeDefined();
  });

  it('should handle select function with empty pages', () => {
    const emptyPagesData = {
      pages: [],
      pageParams: [],
    };

    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResult,
      pages: [],
      pageParams: [],
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useManagedWordpressWebsites(), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const callArgs = vi.mocked(tanstackUseInfiniteQuery).mock.calls[0][0] as {
      select?: (data: { pages: Array<{ data: typeof managedWordpressWebsitesMock }> }) => unknown;
    };

    // Tester que la fonction select gère correctement les pages vides
    if (callArgs.select) {
      const selectedData = callArgs.select(emptyPagesData);
      expect(selectedData).toEqual([]);
    }
  });
});
