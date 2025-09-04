import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { defaultPageSize } from './index';
import { ColumnSort, DatagridColumn, useColumnFilters } from '../../components';

interface IcebergFilter {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  label: string;
}

interface Filters {
  filters: IcebergFilter[];
  add: (filter: IcebergFilter) => void;
  remove: (filter: IcebergFilter) => void;
}

interface Search {
  onSearch: (search: string) => void;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

export type UseResourcesIcebergV2Result<T> = {
  flattenData: T[];
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort | undefined>>;
  sorting: ColumnSort | undefined;
  filters: Filters;
  search: Search;
} & UseInfiniteQueryResult<InfiniteData<IcebergFetchResultV2<T>>, Error>;

export type IcebergV2HookParams<T> = {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
  shouldFetchAll?: boolean;
  columns?: DatagridColumn<T>[];
} & Omit<
  UseInfiniteQueryOptions<IcebergFetchResultV2<T>>,
  // select needs to be omitted because of flattenData
  // @TODO: deprecate flattenData and let user do it via select
  'queryFn' | 'getNextPageParam' | 'initialPageParam' | 'select'
>;

export const API_V2_MAX_PAGE_SIZE = 9999;

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = fetchIcebergV2;

export function useResourcesIcebergV2<T>({
  columns,
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
  disableCache,
  ...options
}: IcebergFetchParamsV2 &
  IcebergV2HookParams<T>): UseResourcesIcebergV2Result<T> {
  const [flattenData, setFlattenData] = useState<T[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState<any>(null);
  const [sorting, setSorting] = useState<ColumnSort | undefined>(
    defaultSorting,
  );
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const query = useInfiniteQuery({
    staleTime: Infinity,
    retry: false,
    ...options,
    initialPageParam: null,
    queryKey: [
      ...queryKey,
      shouldFetchAll ? 'all' : pageSize,
      sorting,
      filters,
      searchFilter,
    ].filter(Boolean),
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<T>({
        route,
        pageSize: shouldFetchAll ? API_V2_MAX_PAGE_SIZE : pageSize,
        cursor: pageParam as string,
        sortBy: sorting?.id || undefined,
        sortOrder: sorting?.desc ? 'DESC' : 'ASC',
        filters: searchFilter ? [searchFilter, ...filters] : filters,
        disableCache,
      }),
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = query.data?.pages.flatMap((page) => page.data);
    setFlattenData(flatten || []);

    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  const searchableColumn = useMemo(
    () =>
      columns?.find(
        (item) =>
          Object.prototype.hasOwnProperty.call(item, 'isSearchable') &&
          item.isSearchable,
      ),
    [columns],
  );

  const onSearch = useCallback(
    (search: string) => {
      if (searchableColumn) {
        setSearchFilter(
          !search || search.length === 0
            ? null
            : {
                key: searchableColumn.id,
                value: searchInput,
                comparator: FilterComparator.Includes,
                label: searchableColumn.id,
              },
        );
      }
    },
    [searchableColumn, searchInput],
  );

  return {
    ...query,
    flattenData,
    setSorting,
    sorting,
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
