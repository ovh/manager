import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IcebergFetchParamsV6,
  applyFilters,
  FilterTypeCategories,
  FilterComparator,
  fetchIcebergV6,
  Filter,
} from '@ovh-ux/manager-core-api';
import { Query, useQuery } from '@tanstack/react-query';
import {
  DatagridColumn,
  useColumnFilters,
  ColumnSort,
} from '@ovh-ux/manager-react-components';

export type ApiData<T> = {
  data: T;
};

export interface ResourcesV6Hook<T> {
  queryKey: string[];
  queryFn?: () => Promise<ApiData<T[]>>;
  refetchInterval?: (query: Query<ApiData<T[]>>) => number | false;
  columns: DatagridColumn<T>[];
  defaultSorting?: ColumnSort;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
function sortColumn(
  type: FilterTypeCategories,
  a: string,
  b: string,
  desc: boolean,
) {
  if (!a || !b) return -1;
  switch (type) {
    case FilterTypeCategories.Numeric:
      return desc
        ? parseFloat(b) - parseFloat(a)
        : parseFloat(a) - parseFloat(b);
    case FilterTypeCategories.Date:
      return desc
        ? new Date(b).getTime() - new Date(a).getTime()
        : new Date(a).getTime() - new Date(b).getTime();
    case FilterTypeCategories.Boolean:
      return desc ? Number(b) - Number(a) : Number(a) - Number(b);
    case FilterTypeCategories.String:
      return desc
        ? b
            ?.trim()
            .toLowerCase()
            ?.localeCompare?.(a?.trim().toLowerCase())
        : a
            .trim()
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare?.(b?.trim()?.toLowerCase());
    default:
      return -1;
  }
}

export function useVolumeBackups<T extends Record<string, unknown>>({
  route,
  queryKey,
  queryFn,
  refetchInterval,
  pageSize = 10,
  columns = [],
  defaultSorting,
}: IcebergFetchParamsV6 & ResourcesV6Hook<T>) {
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState<Filter[]>([]);
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey,
    queryFn: queryFn || (() => fetchIcebergV6<T>({ route })),
    refetchInterval: refetchInterval || false,
    retry: false,
  });

  const [sorting, setSorting] = useState<ColumnSort>();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return applyFilters(data?.data, [...searchFilter, ...filters]);
  }, [searchFilter, data?.data, filters]);

  const filteredAndSortedData = useMemo(() => {
    const currSorting = sorting || defaultSorting;
    if (currSorting) {
      const columnType =
        columns.find((col) => col.id === currSorting.id)?.type ||
        FilterTypeCategories.String;
      return [...filteredData].sort((a, b) =>
        sortColumn(
          columnType,
          `${a?.[currSorting.id]}`,
          `${b?.[currSorting.id]}`,
          currSorting.desc,
        ),
      );
    }
    return filteredData;
  }, [sorting, filteredData]);

  useEffect(() => {
    if (data?.data && data?.data?.length > 0 && totalCount === 0) {
      setTotalCount(data.data.length);
      setFlattenData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    setPageIndex(0);
    setFlattenData(filteredAndSortedData);
  }, [filteredAndSortedData]);

  const fetchNextPage = useCallback(() => setPageIndex((prev) => prev + 1), []);

  const searchableColumns = useMemo(
    () => columns.filter((col: DatagridColumn<T>) => col.isSearchable),
    [columns],
  );

  const onSearch = useCallback((search: string | undefined) => {
    setSearchFilter(
      !search
        ? []
        : searchableColumns.map(({ id }) => ({
            key: id,
            value: search,
            comparator: FilterComparator.Includes,
          })),
    );
  }, []);

  return {
    data,
    sorting,
    setSorting,
    pageIndex,
    totalCount,
    flattenData: flattenData?.slice(0, (pageIndex + 1) * pageSize),
    isError,
    isLoading,
    hasNextPage: pageIndex * pageSize + pageSize <= flattenData?.length,
    fetchNextPage,
    error,
    status,
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
