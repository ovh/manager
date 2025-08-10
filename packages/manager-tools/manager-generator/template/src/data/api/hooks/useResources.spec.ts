import { renderHook } from '@testing-library/react';
import { Mock, afterEach, describe, expect, it, vi } from 'vitest';

import {
  useResourcesIcebergV2,
  useResourcesIcebergV6,
  useResourcesV6,
} from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';

// 2. Now import modules
import { useResources } from './useResources';

// 1. Mock BEFORE importing useResources
vi.mock('@ovh-ux/manager-react-components', () => ({
  useResourcesIcebergV6: vi.fn(),
  useResourcesIcebergV2: vi.fn(),
  useResourcesV6: vi.fn(),
}));

// helper to override APP_FEATURES.listingApi without mutating directly
const setListingApi = (value: 'v6Iceberg' | 'v2' | 'v6') => {
  vi.spyOn(APP_FEATURES, 'listingApi', 'get').mockReturnValue(value);
};

afterEach(() => {
  vi.restoreAllMocks();
});

// eslint-disable-next-line max-lines-per-function
describe('useResources facade hook', () => {
  it('uses useResourcesIcebergV6 when APP_FEATURES.listingApi = "v6Iceberg"', () => {
    setListingApi('v6Iceberg');
    (useResourcesIcebergV6 as Mock).mockReturnValue({
      flattenData: ['v6Iceberg'],
      totalCount: 100,
      hasNextPage: true,
      fetchNextPage: vi.fn(),
      isLoading: false,
      status: 'success',
      sorting: [],
      setSorting: vi.fn(),
      filters: [],
      search: vi.fn(),
    });

    const { result } = renderHook(() =>
      useResources({ route: '/foo', queryKey: ['foo'], pageSize: 10 }),
    );

    expect(result.current.flattenData).toEqual(['v6Iceberg']);
    expect(result.current.totalCount).toBe(100);
  });

  it('uses useResourcesIcebergV2 when APP_FEATURES.listingApi = "v2"', () => {
    setListingApi('v2');
    (useResourcesIcebergV2 as Mock).mockReturnValue({
      flattenData: ['v2'],
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      status: 'success',
      sorting: [],
      setSorting: vi.fn(),
      filters: [],
      search: vi.fn(),
    });

    const { result } = renderHook(() =>
      useResources({ route: '/bar', queryKey: ['bar'], pageSize: 5 }),
    );

    expect(result.current.flattenData).toEqual(['v2']);
    expect(result.current.totalCount).toBeUndefined(); // no total count in v2
  });

  it('falls back to useResourcesV6 when APP_FEATURES.listingApi is not "v6Iceberg" or "v2"', () => {
    setListingApi('v6');
    (useResourcesV6 as Mock).mockReturnValue({
      flattenData: ['v6'],
      totalCount: 50,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      status: 'success',
      sorting: [],
      setSorting: vi.fn(),
      filters: [],
      search: vi.fn(),
    });

    const { result } = renderHook(() =>
      useResources({ route: '/baz', queryKey: ['baz'], pageSize: 20 }),
    );

    expect(result.current.flattenData).toEqual(['v6']);
    expect(result.current.totalCount).toBe(50);
  });
});
