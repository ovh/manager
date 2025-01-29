import { useEffect, useState, useMemo } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  FilterComparator,
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { defaultPageSize } from './index';
import { useColumnFilters, ColumnSort } from '../../components';
import { ColumnFilter } from '../../components/filters/filter-add.component';

interface IcebergV6Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  shouldFetchAll?: boolean;
  columns?: any;
}

export const API_V6_MAX_PAGE_SIZE = 4999;

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV6 = fetchIcebergV6;

export function useResourcesIcebergV6<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
  columns,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');

  console.info('***** filters : ', filters);
  const {
    data: dataSelected,
    hasNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [
      ...queryKey,
      shouldFetchAll ? 'all' : pageSize,
      sorting,
      filters,
    ],
    staleTime: Infinity,
    retry: false,
    queryFn: ({ pageParam: pageIndex }) =>
      fetchIcebergV6<T>({
        route,
        pageSize: shouldFetchAll ? API_V6_MAX_PAGE_SIZE : pageSize,
        page: pageIndex,
        sortBy: sorting?.id || null,
        sortReverse: sorting?.desc,
        filters,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageIndex) => {
      if (lastPage.totalCount / pageSize > lastPageIndex) {
        return lastPageIndex + 1;
      }
      return null;
    },
    select: (data) => {
      const pageIndex = data.pageParams[data.pageParams.length - 1];
      const { totalCount } = data.pages[0];

      return {
        data,
        pageIndex,
        totalCount,
        flattenData: data.pages.flatMap((page) => page.data),
      };
    },
  });

  useEffect(() => {
    if (shouldFetchAll && hasNextPage) {
      fetchNextPage();
    }
  }, [dataSelected]);

  const columnSearchable = useMemo<ColumnFilter[]>(
    () => columns?.find((item) => item.hasOwnProperty('isSearchable')),
    [columns],
  );

  const onSearch = (props: any) => {
    console.info('onSearch searchTest !!!', props);
    if (columnSearchable) {
      console.info('onSearch columnSearchable !!!', columnSearchable);
    }
  };

  return {
    ...(dataSelected ?? { ...dataSelected, totalCount: 0 }),
    hasNextPage,
    fetchNextPage,
    ...rest,
    sorting,
    setSorting,
    filters: {
      filters,
      add: addFilter,
      remove: removeFilter,
    },
    search: {
      onSearch,
      searchInput,
      setSearchInput,
    },
  };
}
