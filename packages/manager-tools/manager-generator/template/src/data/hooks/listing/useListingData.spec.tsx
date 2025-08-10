import { renderHook } from '@testing-library/react';

import { useResources } from '@/data/api/hooks/useResources';
import type { ResourcesFacadeResult } from '@/types/ClientApi.type';

import { useListingData } from './useListingData';

// mock the facade hook
vi.mock('@/data/api/hooks/useResources');
const mockedUseResources = vi.mocked(useResources);

type FacadeResult = ResourcesFacadeResult<Record<string, unknown>>;

describe('useListingData', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty items when flattenData is undefined', () => {
    mockedUseResources.mockReturnValue({
      flattenData: undefined,
      isLoading: false,
    } as FacadeResult);

    const { result } = renderHook(() => useListingData());
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns items when flattenData is provided', () => {
    mockedUseResources.mockReturnValue({
      flattenData: [{ id: 'foo' }, { id: 'bar' }],
      totalCount: 2,
      isLoading: false,
    } as FacadeResult);

    const { result } = renderHook(() => useListingData());
    expect(result.current.items).toEqual([{ id: 'foo' }, { id: 'bar' }]);
    expect(result.current.total).toBe(2);
  });

  it('falls back to items.length when totalCount is undefined', () => {
    mockedUseResources.mockReturnValue({
      flattenData: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      totalCount: undefined,
      isLoading: false,
    } as FacadeResult);

    const { result } = renderHook(() => useListingData());
    expect(result.current.total).toBe(3);
  });

  it('exposes fetchNextPage when available and hasNextPage is true', () => {
    const fetchNextPageMock = vi.fn();

    mockedUseResources.mockReturnValue({
      flattenData: [{ id: 'x' }],
      hasNextPage: true,
      fetchNextPage: fetchNextPageMock,
      isLoading: false,
    } as FacadeResult);

    const { result } = renderHook(() => useListingData());
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage?.();
    expect(fetchNextPageMock).toHaveBeenCalled();
  });

  it('does not expose fetchNextPage when hasNextPage is false', () => {
    const fetchNextPageMock = vi.fn();

    mockedUseResources.mockReturnValue({
      flattenData: [{ id: 'y' }],
      hasNextPage: false,
      fetchNextPage: fetchNextPageMock,
      isLoading: false,
    } as FacadeResult);

    const { result } = renderHook(() => useListingData());
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.fetchNextPage).toBeUndefined();
  });
});
