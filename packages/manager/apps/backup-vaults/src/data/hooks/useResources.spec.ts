import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Small helper to (re)load the module under test with a specific APP_FEATURES.listingApi
async function loadSubject(listingApi: 'v6Iceberg' | 'v2' | 'v6' | undefined) {
  vi.resetModules();

  // Mock APP_FEATURES with the desired listingApi for this test case
  vi.doMock('@/App.constants', () => ({
    APP_FEATURES: { listingApi },
  }));

  // Create hook mocks we can tweak per test
  const useResourcesIcebergV2 = vi.fn();
  const useResourcesIcebergV6 = vi.fn();
  const useResourcesV6 = vi.fn();

  vi.doMock('@ovh-ux/manager-react-components', () => ({
    useResourcesIcebergV2,
    useResourcesIcebergV6,
    useResourcesV6,
  }));

  // Import the subject AFTER mocks are set
  const mod = await import('./useResources'); // <-- ← adjust to your real path

  return {
    ...mod,
    mocks: { useResourcesIcebergV2, useResourcesIcebergV6, useResourcesV6 },
  } as unknown as {
    useResources: (typeof import('./useResources'))['useResources'];
    mocks: {
      useResourcesIcebergV2: ReturnType<typeof vi.fn>;
      useResourcesIcebergV6: ReturnType<typeof vi.fn>;
      useResourcesV6: ReturnType<typeof vi.fn>;
    };
  };
}

// eslint-disable-next-line max-lines-per-function
describe('useResources', () => {
  it('uses v6Iceberg when APP_FEATURES.listingApi === "v6Iceberg"', async () => {
    const { useResources, mocks } = await loadSubject('v6Iceberg');

    const sample = {
      flattenData: [{ id: 1 }],
      totalCount: 123,
      hasNextPage: false,
      isLoading: false,
      status: 'success' as const,
    };
    mocks.useResourcesIcebergV6.mockReturnValue(sample);

    const { result } = renderHook(() =>
      useResources<{ id: number }>({
        route: '/things',
        queryKey: ['listing', '/things'],
      }),
    );

    expect(mocks.useResourcesIcebergV6).toHaveBeenCalledWith({
      route: '/things',
      queryKey: ['listing', '/things'],
    });
    expect(result.current.flattenData).toEqual([{ id: 1 }]);
    expect(result.current.totalCount).toBe(123);
    expect(result.current.status).toBe('success');
  });

  it('uses v2 when APP_FEATURES.listingApi === "v2"', async () => {
    const { useResources, mocks } = await loadSubject('v2');

    const sample = {
      flattenData: [{ id: 'a' }],
      hasNextPage: true,
      fetchNextPage: vi.fn(),
      isLoading: true,
      status: 'pending' as const,
    };
    mocks.useResourcesIcebergV2.mockReturnValue(sample);

    const { result } = renderHook(() =>
      useResources<{ id: string }>({
        route: '/legacy',
        queryKey: ['listing', '/legacy'],
      }),
    );

    expect(mocks.useResourcesIcebergV2).toHaveBeenCalled();
    expect(result.current.flattenData).toEqual([{ id: 'a' }]);
    // v2 mapping intentionally has no totalCount
    expect(result.current.totalCount).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('falls back to v6 when APP_FEATURES.listingApi is "v6" or anything else', async () => {
    const { useResources, mocks } = await loadSubject('v6');

    const sample = {
      flattenData: [{ id: 42 }],
      totalCount: 1,
      hasNextPage: false,
      isLoading: false,
      status: 'success' as const,
    };
    mocks.useResourcesV6.mockReturnValue(sample);

    const { result } = renderHook(() =>
      useResources<{ id: number }>({
        route: '/new',
        queryKey: ['listing', '/new'],
        columns: [],
      }),
    );

    expect(mocks.useResourcesV6).toHaveBeenCalledWith({
      route: '/new',
      queryKey: ['listing', '/new'],
      columns: [],
    });
    expect(result.current.totalCount).toBe(1);
    expect(result.current.flattenData).toEqual([{ id: 42 }]);
  });
});
