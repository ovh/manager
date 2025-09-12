import { vi } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { act, renderHook, RenderHookResult } from '@testing-library/react';
import {
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { useV6 } from '../useV6';
import { ResourcesV6Params } from '../v6.type';
import {
  getWrapper,
  getSorting,
  getFilter,
} from '../../../__tests__/Test.utils';
import { items, columns, ResultObj } from '../../../__mocks__/mock';
import { UseDataApiResult } from '../../../ports/use-data-api/useDataApi.types';
import { UseQueryOptions } from '../../../infra/tanstack/use-query';

vi.mock('@tanstack/react-query', async () => {
  const originalModule = await vi.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vi.fn(),
  };
});

function fetchNextPage(fn: () => void, numberOfTimes: number) {
  for (let i = 0; i < numberOfTimes; i += 1) {
    fn();
  }
}

const renderUseV6Hook = (
  hookParams: Partial<ResourcesV6Params<ResultObj>> = {},
): RenderHookResult<
  UseDataApiResult<ResultObj>,
  ResourcesV6Params<ResultObj>
> => {
  return renderHook(
    () =>
      useV6({
        columns,
        route: '/dedicated/nasha',
        cacheKey: '/dedicated/nasha',
        ...hookParams,
      }),
    {
      wrapper: getWrapper(),
    },
  );
};

const mockData = {
  data: items,
  status: 200,
  totalCount: 50,
};

describe('useV6', () => {
  beforeEach(() => {
    vi.mocked(useQuery).mockImplementation(() => {
      return {
        data: mockData,
        error: null,
        isLoading: false,
        hasNextPage: true,
        staleTime: 3000,
        retry: false,
      } as any;
    });

    vi.clearAllMocks();
  });

  it('should return flattenData with 10 items', async () => {
    const { result } = renderUseV6Hook();
    const { flattenData, totalCount, hasNextPage, pageIndex } = result.current;
    expect(flattenData?.length).toEqual(10);
    expect(totalCount).toEqual(50);
    expect(pageIndex).toEqual(0);
    expect(hasNextPage).toBeTruthy();
  });

  it('fetches next page', () => {
    const { result } = renderUseV6Hook();
    act(() => {
      result.current.fetchNextPage();
    });
    expect(result.current.flattenData.length).toEqual(20);
  });

  it('forwards enabled', () => {
    renderUseV6Hook({ enabled: false });
    const callArg = vi.mocked(useQuery).mock.calls[0]?.[0];
    expect((callArg as unknown as UseQueryOptions).enabled).toBeFalsy();
  });

  it('forwards the refreshInterval', () => {
    renderUseV6Hook({ refetchInterval: 1000 });
    const callArg = vi.mocked(useQuery).mock.calls[0]?.[0];
    expect((callArg as unknown as UseQueryOptions).refetchInterval).toBe(1000);
  });

  it('applies default sorting', () => {
    const { result } = renderUseV6Hook({
      defaultSorting: getSorting('number', false),
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    result.current.flattenData.forEach((item: ResultObj, index) => {
      expect(parseInt(item.number, 10)).toEqual(index + 1);
    });
  });

  it('applies sorting', () => {
    const { result } = renderUseV6Hook({
      defaultSorting: getSorting('number', false),
    });
    act(() => {
      result.current.setSorting!(getSorting('number', true));
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    result.current.flattenData.forEach((item: ResultObj, index) => {
      expect(parseInt(item.number, 10)).toEqual(items.length - index);
    });
  });

  it('applies searching with onSearch', () => {
    const searchTerm = '1';
    const { result } = renderUseV6Hook();
    act(() => {
      result.current.search!.onSearch(searchTerm);
    });
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(item.name).toContain(searchTerm);
    });
  });

  it('applies searching with setSearchInput', () => {
    const searchTerm = '1';
    const { result } = renderUseV6Hook();
    act(() => {
      result.current.search!.setSearchInput(searchTerm);
    });
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(item.name).toContain(searchTerm);
    });
  });

  it('applies filtering and then removes it', () => {
    const filterTerm1 = 15;
    const filterTerm2 = 36;
    const { result } = renderUseV6Hook();

    // first applies the filter num > 15
    act(() => {
      result.current.filters!.add(
        getFilter(
          'number',
          String(filterTerm1),
          FilterComparator.IsHigher,
          FilterTypeCategories.Numeric,
        ),
      );
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(35);
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(parseInt(item.number, 10)).toBeGreaterThan(filterTerm1);
    });

    // then applies the filter num < 36 (current filter: 15 < num < 36)
    act(() => {
      result.current.filters!.add(
        getFilter(
          'number',
          String(filterTerm2),
          FilterComparator.IsLower,
          FilterTypeCategories.Numeric,
        ),
      );
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(20);
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(
        parseInt(item.number, 10) > filterTerm1 &&
          parseInt(item.number, 10) < filterTerm2,
      ).toBeTruthy();
    });

    // then removes the first filter (current filter: num < 36)
    act(() => {
      result.current.filters!.remove(result.current.filters!.filters[0]!);
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(35);
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(parseInt(item.number, 10)).toBeLessThan(filterTerm2);
    });
  });

  it('performs all data operations of search/sort/filter', () => {
    // first tests the default sorting
    const { result } = renderUseV6Hook({
      defaultSorting: getSorting('number', false),
    });
    result.current.flattenData.forEach((item: ResultObj, index) => {
      expect(parseInt(item.number, 10)).toBe(index + 1);
    });

    // then apply filter num > 15
    act(() => {
      result.current.filters!.add(
        getFilter(
          'number',
          String(15),
          FilterComparator.IsHigher,
          FilterTypeCategories.Numeric,
        ),
      );
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(35);
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(parseInt(item.number, 10)).toBeGreaterThan(15);
    });

    // apply sorting descending order
    act(() => {
      (result.current as UseDataApiResult).setSorting!(
        getSorting('number', true),
      );
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(35);
    result.current.flattenData.forEach((item: ResultObj, index: number) => {
      expect(parseInt(item.number, 10)).toEqual(items.length - index);
    });

    // apply searching with search term = 3
    act(() => {
      result.current.search!.onSearch('3');
    });
    act(() => {
      fetchNextPage(result.current.fetchNextPage, 4);
    });
    expect(result.current.flattenData.length).toBe(12);
    result.current.flattenData.forEach((item: ResultObj) => {
      expect(item.number).toContain('3');
    });
  });
});
