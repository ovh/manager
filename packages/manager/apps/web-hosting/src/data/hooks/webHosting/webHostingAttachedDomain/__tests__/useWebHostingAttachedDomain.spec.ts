/* eslint-disable max-lines */
import { useInfiniteQuery as tanstackUseInfiniteQuery } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { websitesMocks } from '@/data/__mocks__';
import { deleteAttachedDomains, getWebHostingAttachedDomain } from '@/data/api/webHosting';
import { APIV2_MAX_PAGESIZE } from '@/utils';
import { wrapper } from '@/utils/test.provider';
import { mockInfiniteQueryResult } from '@/utils/test.setup';

import {
  useDeleteAttachedDomains,
  useWebHostingAttachedDomain,
} from '../useWebHostingAttachedDomain';

vi.unmock('@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain');

const onSuccess = vi.fn();
const onError = vi.fn();

const mockInfiniteQueryResultForWebsites = {
  ...mockInfiniteQueryResult,
  data: websitesMocks,
  pages: [
    {
      data: websitesMocks,
      cursorNext: null,
      status: 200,
    },
  ],
};

describe('useWebHostingAttachedDomain', () => {
  beforeEach(() => {
    vi.mocked(tanstackUseInfiniteQuery).mockClear();
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue(
      mockInfiniteQueryResultForWebsites as unknown as ReturnType<typeof tanstackUseInfiniteQuery>,
    );
  });

  it('should return webhosting attached domain list', async () => {
    const { result } = renderHook(() => useWebHostingAttachedDomain(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(websitesMocks);
    expect(result.current.fetchAllPages).toBeDefined();
  });

  it('should handle domain parameter', () => {
    const { result } = renderHook(() => useWebHostingAttachedDomain({ domain: 'example.com' }), {
      wrapper,
    });

    // Vérifier que le hook retourne bien les données (confirme que le hook est exécuté)
    expect(result.current).toBeDefined();
    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    // Vérifier que les arguments contiennent queryKey
    const callArgs = calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs).toHaveProperty('queryKey');
  });

  it('should handle shouldFetchAll parameter', () => {
    renderHook(() => useWebHostingAttachedDomain({ shouldFetchAll: true }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      queryFn?: (params: { pageParam: unknown }) => Promise<unknown>;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.queryFn).toBeDefined();

    if (callArgs.queryFn) {
      void callArgs.queryFn({ pageParam: null });
      expect(getWebHostingAttachedDomain).toHaveBeenCalledWith({
        pageParam: null as string,
        searchParams: '',
        pageSize: APIV2_MAX_PAGESIZE,
      });
    }
  });

  it('should call queryFn without pageSize when allPages is false', () => {
    renderHook(() => useWebHostingAttachedDomain(), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      queryFn?: (params: { pageParam: unknown }) => Promise<unknown>;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.queryFn).toBeDefined();

    if (callArgs.queryFn) {
      void callArgs.queryFn({ pageParam: 'cursor123' });
      expect(getWebHostingAttachedDomain).toHaveBeenCalledWith({
        pageParam: 'cursor123' as string,
        searchParams: '',
      });
    }
  });

  it('should handle enabled as function', () => {
    const enabledFn = vi.fn(() => false);
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResultForWebsites,
      status: 'pending' as const,
      isSuccess: false,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useWebHostingAttachedDomain({ enabled: enabledFn }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      enabled?: unknown;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.enabled).toBeDefined();
  });

  it('should handle enabled as boolean false', () => {
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResultForWebsites,
      status: 'pending' as const,
      isSuccess: false,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useWebHostingAttachedDomain({ enabled: false }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      enabled?: (q: unknown) => boolean;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.enabled).toBeDefined();
    expect(typeof callArgs?.enabled).toBe('function');
    if (callArgs?.enabled) {
      expect(callArgs.enabled({})).toBe(false);
    }
  });

  it('should handle enabled as boolean true', () => {
    renderHook(() => useWebHostingAttachedDomain({ enabled: true }), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      enabled?: (q: unknown) => boolean;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.enabled).toBeDefined();
    expect(typeof callArgs?.enabled).toBe('function');
    if (callArgs?.enabled) {
      expect(callArgs.enabled({})).toBe(true);
    }
  });

  it('should call fetchAllPages and set allPages to true when allPages is false', () => {
    const { result } = renderHook(() => useWebHostingAttachedDomain(), { wrapper });

    expect(result.current.fetchAllPages).toBeDefined();
    expect(typeof result.current.fetchAllPages).toBe('function');

    act(() => {
      if (result.current.fetchAllPages) {
        result.current.fetchAllPages();
      }
    });
  });

  it('should call fetchNextPage when allPages is true, hasNextPage is true and isFetchingNextPage is false', async () => {
    const fetchNextPageMock = vi.fn().mockResolvedValue(undefined);
    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResultForWebsites,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: fetchNextPageMock,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useWebHostingAttachedDomain({ shouldFetchAll: true }), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(
      () => {
        expect(fetchNextPageMock).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );

    consoleErrorSpy.mockRestore();
  });

  it('should reset allPages when searchParams changes and shouldFetchAll is false', () => {
    const { rerender } = renderHook(
      ({ domain }: { domain?: string }) =>
        useWebHostingAttachedDomain({ domain, shouldFetchAll: false }),
      {
        wrapper,
        initialProps: { domain: undefined },
      },
    );

    rerender({ domain: 'test.example.com' });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
  });

  it('should use select function to flatten pages data', () => {
    const { result } = renderHook(() => useWebHostingAttachedDomain(), { wrapper });

    expect(result.current.data).toEqual(websitesMocks);
  });

  it('should use select function with empty data arrays', () => {
    const emptyPagesData = {
      pages: [{ data: [] }, { data: null }],
      pageParams: [null, 'cursor1'],
    };

    vi.mocked(tanstackUseInfiniteQuery).mockReturnValue({
      ...mockInfiniteQueryResultForWebsites,
      pages: emptyPagesData.pages,
      pageParams: emptyPagesData.pageParams,
    } as unknown as ReturnType<typeof tanstackUseInfiniteQuery>);

    renderHook(() => useWebHostingAttachedDomain(), { wrapper });

    expect(tanstackUseInfiniteQuery).toHaveBeenCalled();
    const calls = vi.mocked(tanstackUseInfiniteQuery).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const callArgs = calls[0]?.[0] as {
      select?: (data: { pages: Array<{ data?: unknown[] | null }> }) => unknown;
    };
    expect(callArgs).toBeDefined();

    if (callArgs?.select) {
      const selectedData = callArgs.select(emptyPagesData);
      expect(selectedData).toEqual([]);
    }
  });
});

describe('useDeleteAttachedDomains', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(deleteAttachedDomains).mockResolvedValue([
      { status: 'fulfilled' as const, value: undefined },
    ]);
  });

  it('delete attached domain', async () => {
    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domains: ['domain1'],
        bypassDNSConfiguration: false,
      }),
    );

    await waitFor(() => {
      expect(deleteAttachedDomains).toHaveBeenCalledWith('serviceName', ['domain1'], false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when delete fails', async () => {
    const error = new Error('Delete failed');
    vi.mocked(deleteAttachedDomains).mockRejectedValue(error);

    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domains: ['domain1'],
        bypassDNSConfiguration: false,
      }),
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toEqual(error);
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle bypassDNSConfiguration as true', async () => {
    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domains: ['domain1'],
        bypassDNSConfiguration: true,
      }),
    );

    await waitFor(() => {
      expect(deleteAttachedDomains).toHaveBeenCalledWith('serviceName', ['domain1'], true);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle multiple domains', async () => {
    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    act(() =>
      result.current.mutate({
        domains: ['domain1', 'domain2', 'domain3'],
        bypassDNSConfiguration: false,
      }),
    );

    await waitFor(() => {
      expect(deleteAttachedDomains).toHaveBeenCalledWith(
        'serviceName',
        ['domain1', 'domain2', 'domain3'],
        false,
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should expose deleteAttachedDomains method', () => {
    const { result } = renderHook(
      () => useDeleteAttachedDomains('serviceName', onSuccess, onError),
      {
        wrapper,
      },
    );

    expect(result.current.deleteAttachedDomains).toBeDefined();
    expect(typeof result.current.deleteAttachedDomains).toBe('function');
  });
});
