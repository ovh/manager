import React from 'react';
import { vitest } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { ResourcesV6Params, useResourcesV6 } from './useResourcesV6';

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vitest.fn(),
  };
});

function renderUseResourcesV6Hook<T>(
  hookParams: Partial<ResourcesV6Params<T>> = {},
) {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const columns = [
    {
      id: 'name',
      label: 'name',
      comparator: FilterCategories.String,
      isFilterable: true,
      isSearchable: true,
      type: FilterTypeCategories.String,
      cell: (props: any) => <div>{props.name}</div>,
    },
    {
      id: 'age',
      label: 'age',
      comparator: FilterCategories.Numeric,
      isSearchable: true,
      isFilterable: true,
      type: FilterTypeCategories.Numeric,
      cell: (props: any) => <div>{props.name}</div>,
    },
  ];

  return renderHook(
    () =>
      useResourcesV6({
        columns,
        route: '/dedicated/nasha',
        queryKey: ['/dedicated/nasha'],
        ...hookParams,
      } as any),
    {
      wrapper,
    },
  );
}

const mockData = {
  data: [...Array(26).keys()].map((_, i) => ({
    name: `ns5007027.ip-51-${i}-XXXXX5.net`,
    age: i,
  })),
  status: 200,
  totalCount: 26,
};

describe('useResourcesV6', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockData,
      error: null,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));
  });

  it('should return flattenData with 10 items, 10 items by cursor', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return flattenData with 20 items sorted by cursor without dupicated elements', async () => {
    const hook = renderUseResourcesV6Hook();
    act(() => hook.rerender());
    act(() => hook.result.current.setSorting({ desc: false, id: 'name' }));
    act(() => hook.rerender());
    act(() => hook.result.current.fetchNextPage());
    act(() => hook.rerender());
    const { flattenData } = hook.result.current as unknown as {
      flattenData: { name: string }[];
    };
    expect(new Set(flattenData.map((data) => data.name)).size).toEqual(
      flattenData.length,
    );
    expect(flattenData.length).toEqual(20);
  });

  it('should return hasNextPage with true, it rests 16 items to display', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });

  it('should return pageIndex with 0 at the launch of the hook', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { pageIndex } = result.current;
    expect(pageIndex).toEqual(0);
  });

  it('should return totalCount with 26', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { totalCount } = result.current;
    expect(totalCount).toEqual(26);
  });

  it('should match ip-51-7 with a filter name', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        comparator: 'includes' as FilterComparator,
        key: 'name',
        value: 'ns5007027.ip-51-7-XXXXX5.net',
        label: 'name',
      });
    });
    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBe(1);
      expect(flattenData?.[0]?.name).toBe('ns5007027.ip-51-7-XXXXX5.net');
    });
  });

  it('should search a service with 25 in name or age', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('25');
    });

    waitFor(() => {
      const { search, flattenData } = result.current;
      expect(flattenData.length).toBe(1);
      expect(search.searchInput).toBe('25');
      expect(flattenData?.[0]?.name).toBe('ns5007027.ip-51-25-XXXXX5.net');
    });
  });

  it('should search a service with 19 in name or age', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('19');
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(1);
      expect(current.flattenData?.[0]?.age).toBe(19);
    });
  });

  it('should search a service with ns5007027.ip-51-21 in name or age', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('ns5007027.ip-51-21');
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(1);
      expect(current.flattenData?.[0]?.name).toBe(
        'ns5007027.ip-51-21-XXXXX5.net',
      );
      expect(current.flattenData?.[0]?.age).toBe(21);
    });
  });

  it('should filter age service that contains 2', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '19',
        label: 'age',
        comparator: FilterComparator.IsHigher,
      });
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(6);
      expect(current.flattenData?.[0]?.age).toBe(25);
    });
  });
  it('should filter age service that contains 2 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '19',
        label: 'age',
        comparator: FilterComparator.IsHigher,
      });
      result.current.setSorting({ id: 'age', desc: false });
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(6);
      expect(current.flattenData?.[0]?.age).toBe(25);
    });
  });

  it('should search service that contains 17, filters lower than 23 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '23',
        label: 'age',
        comparator: FilterComparator.IsLower,
      });
      result.current.setSorting({ id: 'age', desc: false });
      result.current.search.onSearch('17');
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(1);
      expect(current.flattenData?.[0]?.age).toBe(17);
    });
  });

  it('should search service that contains 17, filters upper than 23 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '23',
        label: 'age',
        comparator: FilterComparator.IsHigher,
      });
      result.current.setSorting({ id: 'age', desc: false });
      result.current.search.onSearch('17');
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(0);
    });
  });

  it('should use the custom queryFn when provided', async () => {
    const customQueryFn = vitest.fn().mockResolvedValue({
      data: [{ name: 'Custom Data', age: 99 }],
    });

    (useQuery as jest.Mock).mockImplementationOnce(({ queryFn }) => ({
      data: queryFn(),
      error: null,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));

    renderUseResourcesV6Hook({
      queryFn: customQueryFn,
    });

    expect(customQueryFn).toHaveBeenCalledTimes(1);
    expect(customQueryFn).toHaveBeenCalledWith('/dedicated/nasha');
  });

  it('should apply defaultSorting when provided', async () => {
    const defaultSorting = { id: 'age', desc: true };

    const { result } = renderUseResourcesV6Hook({ defaultSorting });

    waitFor(() => {
      const { flattenData } = result.current;
      // With descending sort on age, first item should have highest age
      expect(flattenData?.[0]?.age).toBe(25);
    });
  });

  it('should use the provided refetchInterval function', async () => {
    const mockRefetchInterval = vitest.fn().mockReturnValue(5000);

    renderUseResourcesV6Hook({ refetchInterval: mockRefetchInterval });

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        refetchInterval: mockRefetchInterval,
      }),
    );
  });
});
