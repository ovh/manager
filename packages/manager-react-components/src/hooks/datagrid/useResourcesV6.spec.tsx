import React from 'react';
import { vitest } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  IcebergFetchParamsV6,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { ResourcesV6Hook, useResourcesV6 } from './useResourcesV6';

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vitest.fn(),
  };
});

const renderUseResourcesV6Hook = (
  hookParams: Partial<IcebergFetchParamsV6 & ResourcesV6Hook> = {},
) => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const columns = [
    {
      id: 'name',
      header: 'name',
      label: 'name',
      accessorKey: 'name',
      comparator: FilterCategories.String,
      isFilterable: true,
      isSearchable: true,
      type: 'string',
      cell: (props: any) => <div>{props.name}</div>,
    },
    {
      id: 'age',
      header: 'age',
      label: 'age',
      accessorKey: 'age',
      comparator: FilterCategories.String,
      isSearchable: true,
      isFilterable: true,
      type: 'number',
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
      }),
    {
      wrapper,
    },
  );
};

const mockData = {
  data: [...Array(26).keys()].map((_, i) => ({
    name: `ns5007027.ip-51-${i}-XXXXX5.net`,
    age: i,
  })),
  status: 200,
  totalCount: 26,
};

interface TestItem {
  name: string;
  age: number | null;
  date?: string;
  active?: boolean;
  description?: string;
}

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
    const { flattenData } = hook.result.current as {
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
      const { flattenData, filters } = result.current;
      expect(flattenData.length).toBe(1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(flattenData[0].name).toBe('ns5007027.ip-51-7-XXXXX5.net');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(filters.value).toBe('ns5007027.ip-51-7-XXXXX5.net');
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(flattenData[0].name).toBe('ns5007027.ip-51-25-XXXXX5.net');
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(current.flattenData[0].age.toBe(19));
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
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        current.flattenData[0].name.toBe('ns5007027.ip-51-21-XXXXX5.net'),
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(current.flattenData[0].age.toBe(21));
    });
  });

  it('should filter age service that contains 2', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '19',
        label: 'Age',
        comparator: FilterComparator.IsHigher,
      });
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(6);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(current.flattenData[0].age).toBe(25);
    });
  });
  it('should filter age service that contains 2 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '19',
        label: 'Age',
        comparator: FilterComparator.IsHigher,
      });
      result.current.setSorting({ id: 'age', desc: false });
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(6);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(current.flattenData[0].age).toBe(25);
    });
  });

  it('should search service that contains 17, filters lower than 23 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '23',
        label: 'Age',
        comparator: FilterComparator.IsLower,
      });
      result.current.setSorting({ id: 'age', desc: false });
      result.current.search.onSearch('17');
    });

    waitFor(() => {
      const { current } = result;
      expect(current.flattenData.length).toBe(1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(current.flattenData[0].age).toBe(17);
    });
  });

  it('should search service that contains 17, filters upper than 23 and display by sorting age asc', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '23',
        label: 'Age',
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

  it('should handle empty search input correctly', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('');
    });

    waitFor(() => {
      const { search, flattenData } = result.current;
      expect(flattenData.length).toBe(10); // Default page size
      expect(search.searchInput).toBe('');
    });
  });

  it('should handle null data from API correctly', async () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: false,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    const { result } = renderUseResourcesV6Hook();
    expect(result.current.flattenData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should handle loading state correctly', async () => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: null,
      error: null,
      isLoading: true,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    const { result } = renderUseResourcesV6Hook();
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle multiple filters correctly', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '20',
        label: 'Age',
        comparator: FilterComparator.IsHigher,
      });
      result.current.filters.add({
        key: 'name',
        value: 'ns5007027',
        label: 'Name',
        comparator: FilterComparator.Includes,
      });
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every(
          (item: TestItem) => item.age > 20 && item.name.includes('ns5007027'),
        ),
      ).toBe(true);
    });
  });

  it('should handle pagination correctly when data changes', async () => {
    const { result } = renderUseResourcesV6Hook();

    expect(result.current.flattenData.length).toBe(10);

    act(() => {
      result.current.fetchNextPage();
    });

    expect(result.current.flattenData.length).toBe(20);

    const newMockData = {
      data: [...Array(5).keys()].map((_, i) => ({
        name: `new-ns5007027.ip-51-${i}-XXXXX5.net`,
        age: i,
      })) as TestItem[],
      status: 200,
      totalCount: 5,
    };

    (useQuery as jest.Mock).mockImplementation(() => ({
      data: newMockData,
      error: null,
      isLoading: false,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    act(() => {
      result.current.search.onSearch('');
    });

    waitFor(() => {
      expect(result.current.flattenData.length).toBe(5);
      expect(result.current.pageIndex).toBe(0);
    });
  });

  it('should handle column type sorting correctly', async () => {
    const mockDataWithTypes = {
      data: [
        { name: 'C', age: 3, date: '2023-01-01', active: true },
        { name: 'A', age: 1, date: '2023-03-01', active: false },
        { name: 'B', age: 2, date: '2023-02-01', active: true },
      ] as TestItem[],
      status: 200,
      totalCount: 3,
    };

    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockDataWithTypes,
      error: null,
      isLoading: false,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    const columns = [
      {
        id: 'name',
        label: 'Name',
        type: 'string',
        isSearchable: true,
        cell: (props: any) => <div>{props.name}</div>,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        isSearchable: true,
        cell: (props: any) => <div>{props.age}</div>,
      },
      {
        id: 'date',
        label: 'Date',
        type: 'date',
        isSearchable: true,
        cell: (props: any) => <div>{props.date}</div>,
      },
      {
        id: 'active',
        label: 'Active',
        type: 'boolean',
        isSearchable: true,
        cell: (props: any) => <div>{props.active}</div>,
      },
    ];

    const { result } = renderUseResourcesV6Hook({ columns });

    act(() => {
      result.current.setSorting({ id: 'name', desc: false });
    });
    waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((result.current.flattenData[0] as TestItem).name).toBe('A');
    });

    act(() => {
      result.current.setSorting({ id: 'age', desc: true });
    });
    waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((result.current.flattenData[0] as TestItem).age).toBe(3);
    });

    act(() => {
      result.current.setSorting({ id: 'date', desc: false });
    });
    waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((result.current.flattenData[0] as TestItem).date).toBe(
        '2023-01-01',
      );
    });

    act(() => {
      result.current.setSorting({ id: 'active', desc: true });
    });
    waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((result.current.flattenData[0] as TestItem).active).toBe(true);
    });
  });

  it('should search across all searchable columns', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('ns5007027');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every((item: TestItem) => item.name.includes('ns5007027')),
      ).toBe(true);
    });
  });

  it('should handle case-insensitive search', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('NS5007027');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every((item: TestItem) =>
          item.name.toLowerCase().includes('ns5007027'),
        ),
      ).toBe(true);
    });
  });

  it('should handle partial matches', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('7027');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every((item: TestItem) => item.name.includes('7027')),
      ).toBe(true);
    });
  });

  it('should handle search with whitespace', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('  ns5007027  ');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every((item: TestItem) => item.name.includes('ns5007027')),
      ).toBe(true);
    });
  });

  it('should handle search with no results', async () => {
    const { result } = renderUseResourcesV6Hook();
    act(() => {
      result.current.search.onSearch('nonexistentvalue123');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBe(0);
    });
  });

  it('should handle search state updates', async () => {
    const { result } = renderUseResourcesV6Hook();

    act(() => {
      result.current.search.onSearch('ns5007027');
    });

    waitFor(() => {
      expect(result.current.search.searchInput).toBe('ns5007027');
    });

    act(() => {
      result.current.search.onSearch('25');
    });

    waitFor(() => {
      expect(result.current.search.searchInput).toBe('25');
    });

    act(() => {
      result.current.search.onSearch('');
    });

    waitFor(() => {
      expect(result.current.search.searchInput).toBe('');
      expect(result.current.flattenData.length).toBe(10); // Default page size
    });
  });

  it('should handle search with multiple searchable columns', async () => {
    const mockDataWithMultipleColumns = {
      data: [
        { name: 'test1', age: 25, description: 'test description' },
        { name: 'test2', age: 30, description: 'another test' },
        { name: 'test3', age: 35, description: 'final test' },
      ] as TestItem[],
      status: 200,
      totalCount: 3,
    };

    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockDataWithMultipleColumns,
      error: null,
      isLoading: false,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    const columns = [
      {
        id: 'name',
        label: 'Name',
        type: 'string',
        isSearchable: true,
        cell: (props: any) => <div>{props.name}</div>,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        isSearchable: true,
        cell: (props: any) => <div>{props.age}</div>,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'string',
        isSearchable: true,
        cell: (props: any) => <div>{props.description}</div>,
      },
    ];

    const { result } = renderUseResourcesV6Hook({ columns });

    act(() => {
      result.current.search.onSearch('test1');
    });

    waitFor(() => {
      expect(result.current.flattenData.length).toBe(1);
      expect((result.current.flattenData[0] as TestItem).name).toBe('test1');
    });

    act(() => {
      result.current.search.onSearch('another');
    });

    waitFor(() => {
      expect(result.current.flattenData.length).toBe(1);
      expect((result.current.flattenData[0] as TestItem).description).toBe(
        'another test',
      );
    });

    act(() => {
      result.current.search.onSearch('35');
    });

    waitFor(() => {
      expect(result.current.flattenData.length).toBe(1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((result.current.flattenData[0] as TestItem).age).toBe(35);
    });
  });

  it('should handle combination of filters and search', async () => {
    const { result } = renderUseResourcesV6Hook();

    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '20',
        label: 'Age',
        comparator: FilterComparator.IsHigher,
      });
    });

    act(() => {
      result.current.search.onSearch('25');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every(
          (item: TestItem) =>
            item.age > 20 && (item.name.includes('25') || item.age === 25),
        ),
      ).toBe(true);
    });

    act(() => {
      result.current.filters.add({
        key: 'name',
        value: 'ns5007027',
        label: 'Name',
        comparator: FilterComparator.Includes,
      });
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every(
          (item: TestItem) =>
            item.age > 20 &&
            item.name.includes('ns5007027') &&
            (item.name.includes('25') || item.age === 25),
        ),
      ).toBe(true);
    });

    act(() => {
      result.current.search.onSearch('');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every(
          (item: TestItem) => item.age > 20 && item.name.includes('ns5007027'),
        ),
      ).toBe(true);
    });

    act(() => {
      result.current.filters.remove({
        key: 'age',
        value: '20',
        comparator: FilterComparator.IsHigher,
      });
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBeGreaterThan(0);
      expect(
        flattenData.every((item: TestItem) => item.name.includes('ns5007027')),
      ).toBe(true);
    });
  });

  it('should handle complex search and filter combinations', async () => {
    const mockDataWithComplexTypes = {
      data: [
        {
          name: 'test1',
          age: 25,
          date: '2023-01-01',
          active: true,
          description: 'test description',
        },
        {
          name: 'test2',
          age: 30,
          date: '2023-03-01',
          active: false,
          description: 'another test',
        },
        {
          name: 'test3',
          age: 35,
          date: '2023-02-01',
          active: true,
          description: 'final test',
        },
        {
          name: 'test4',
          age: 40,
          date: '2023-04-01',
          active: true,
          description: 'test again',
        },
      ] as TestItem[],
      status: 200,
      totalCount: 4,
    };

    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockDataWithComplexTypes,
      error: null,
      isLoading: false,
      hasNextPage: false,
      staleTime: 3000,
      retry: false,
    }));

    const columns = [
      {
        id: 'name',
        label: 'Name',
        type: 'string',
        isSearchable: true,
        cell: (props: any) => <div>{props.name}</div>,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        isSearchable: true,
        cell: (props: any) => <div>{props.age}</div>,
      },
      {
        id: 'date',
        label: 'Date',
        type: 'date',
        isSearchable: true,
        cell: (props: any) => <div>{props.date}</div>,
      },
      {
        id: 'active',
        label: 'Active',
        type: 'boolean',
        isSearchable: true,
        cell: (props: any) => <div>{props.active}</div>,
      },
      {
        id: 'description',
        label: 'Description',
        type: 'string',
        isSearchable: true,
        cell: (props: any) => <div>{props.description}</div>,
      },
    ];

    const { result } = renderUseResourcesV6Hook({ columns });

    act(() => {
      result.current.filters.add({
        key: 'active',
        value: 'true',
        label: 'Active',
        comparator: FilterComparator.IsEqual,
      });
    });

    act(() => {
      result.current.search.onSearch('test');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBe(3);
      expect(
        flattenData.every(
          (item: TestItem) =>
            item.active === true && item.description.includes('test'),
        ),
      ).toBe(true);
    });

    act(() => {
      result.current.filters.add({
        key: 'age',
        value: '30',
        label: 'Age',
        comparator: FilterComparator.IsHigher,
      });
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBe(2);
      expect(
        flattenData.every(
          (item: TestItem) =>
            item.active === true &&
            item.description.includes('test') &&
            item.age > 30,
        ),
      ).toBe(true);
    });

    act(() => {
      result.current.search.onSearch('final');
    });

    waitFor(() => {
      const { flattenData } = result.current;
      expect(flattenData.length).toBe(1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((flattenData[0] as TestItem).description).toBe('final test');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((flattenData[0] as TestItem).age).toBe(35);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect((flattenData[0] as TestItem).active).toBe(true);
    });
  });
});
