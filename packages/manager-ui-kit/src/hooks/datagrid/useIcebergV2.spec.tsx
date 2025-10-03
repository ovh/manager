import React from 'react';
import { vitest } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { useResourcesIcebergV2 } from './useIcebergV2';

interface TestData {
  ip: string;
  newUpgradeSystem: boolean;
}

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useInfiniteQuery: vitest.fn(),
  };
});

const mockAddFilter = vitest.fn();
const mockRemoveFilter = vitest.fn();
const mockFilters: any[] = [];

vitest.mock('../../components', () => ({
  useColumnFilters: () => ({
    filters: mockFilters,
    addFilter: mockAddFilter,
    removeFilter: mockRemoveFilter,
  }),
}));

const renderUseIcebergV2Hook = (props = {}) => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(
    () =>
      useResourcesIcebergV2<TestData>({
        route: '/dedicated/nasha',
        queryKey: ['/dedicated/nasha'],
        columns: [
          {
            id: 'ip',
            isSearchable: true,
            label: 'IP Address',
            cell: (data: TestData) => <div>{data.ip}</div>,
          },
          {
            id: 'newUpgradeSystem',
            isFilterable: true,
            label: 'Upgrade System',
            cell: (data: TestData) => <div>{data.newUpgradeSystem}</div>,
          },
        ],
        ...props,
      }),
    {
      wrapper,
    },
  );

  return result;
};

const mockData = {
  pages: [
    {
      data: [
        {
          ip: '51.222.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '15.235.xxx.xxx',
          newUpgradeSystem: false,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '51.222.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '51.161.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '15.234.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '139.99.xxx.xxx',
          newUpgradeSystem: true,
        },
      ],
      status: 200,
      cursorNext: 'P9/pJ3+99fFh2OXXXXX',
    },
  ],
  pageParams: [null, 2],
};

describe('useIcebergV2', () => {
  beforeEach(() => {
    (useInfiniteQuery as jest.Mock).mockImplementation(() => ({
      data: mockData,
      error: null as unknown,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));
    mockAddFilter.mockClear();
    mockRemoveFilter.mockClear();
  });

  it('should return flattenData with 10 items', async () => {
    const result = renderUseIcebergV2Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return hasNextPage with true', async () => {
    const result = renderUseIcebergV2Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });

  describe('Search functionality', () => {
    it('should trigger search with correct filter', () => {
      const result = renderUseIcebergV2Hook();

      act(() => {
        result.current.search.setSearchInput('51.222');
      });

      waitFor(() => {
        expect(result?.current?.search.searchInput).toBe('51.222');
        expect(mockAddFilter).toHaveBeenCalledWith({
          key: 'ip',
          value: '51.222',
          comparator: FilterComparator.IsEqual,
          label: 'IP Address',
        });
      });
    });

    it('should call onSearch with correct parameters', () => {
      const result = renderUseIcebergV2Hook();
      const searchTerm = '51.222';

      act(() => {
        result.current.search.setSearchInput(searchTerm);
        result.current.search.onSearch(searchTerm);
      });

      waitFor(() => {
        expect(mockAddFilter).toHaveBeenCalledWith({
          key: 'ip',
          value: searchTerm,
          comparator: FilterComparator.IsEqual,
          label: 'IP Address',
        });
      });
    });
  });

  describe('Filter functionality', () => {
    it('should add a filter', () => {
      const result = renderUseIcebergV2Hook();

      act(() => {
        result.current.filters.add({
          key: 'newUpgradeSystem',
          value: 'true',
          comparator: FilterComparator.IsEqual,
          label: 'Upgrade System',
        });
      });

      waitFor(() => {
        expect(result.current.filters.filters).toHaveLength(1);
        expect(result.current.filters.filters[0]).toEqual({
          key: 'newUpgradeSystem',
          value: 'true',
          comparator: FilterComparator.IsEqual,
          label: 'Upgrade System',
        });
      });
    });

    it('should call addFilter with correct parameters', () => {
      const result = renderUseIcebergV2Hook();
      const filter = {
        key: 'newUpgradeSystem',
        value: 'true',
        comparator: FilterComparator.IsEqual,
        label: 'Upgrade System',
      };

      act(() => {
        result.current.filters.add(filter);
      });

      expect(mockAddFilter).toHaveBeenCalledWith(filter);
    });

    it('should remove a filter', () => {
      const result = renderUseIcebergV2Hook();
      const filter = {
        key: 'newUpgradeSystem',
        value: 'true',
        comparator: FilterComparator.IsEqual,
        label: 'Upgrade System',
      };

      act(() => {
        result.current.filters.add(filter);
        result.current.filters.remove(filter);
      });

      expect(result.current.filters.filters).toHaveLength(0);
    });
  });

  describe('Combined Search and Filter', () => {
    it('should handle both search and filters together', async () => {
      const result = renderUseIcebergV2Hook();

      act(() => {
        result.current.filters.add({
          key: 'newUpgradeSystem',
          value: 'true',
          comparator: FilterComparator.IsEqual,
          label: 'Upgrade System',
        });
        result.current.search.setSearchInput('51.222');
        result.current.search.onSearch('51.222');
      });

      waitFor(() => {
        expect(result.current.filters.filters).toHaveLength(1);
        expect(result.current.filters.filters[0]).toEqual({
          key: 'newUpgradeSystem',
          value: 'true',
          comparator: FilterComparator.IsEqual,
          label: 'Upgrade System',
        });
        expect(result.current.search.searchInput).toBe('51.222');
      });
    });
  });
});
