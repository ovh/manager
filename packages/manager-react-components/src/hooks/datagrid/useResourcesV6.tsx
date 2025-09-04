import React, { useState, useEffect, useMemo, useCallback } from 'react';
import isDate from 'lodash.isdate';
import {
  applyFilters,
  FilterTypeCategories,
  FilterComparator,
  Filter,
  v6,
} from '@ovh-ux/manager-core-api';
import { Query, useQuery } from '@tanstack/react-query';
import { DatagridColumn, useColumnFilters, ColumnSort } from '../../components';

export type FetchResultV6<T> = {
  data: T[];
};

export interface ResourcesV6Params<T> {
  queryKey: string[];
  queryFn?: (route: string) => Promise<FetchResultV6<T>>;
  refetchInterval?: (query: Query<FetchResultV6<T>>) => number | false;
  columns: DatagridColumn<T>[];
  defaultSorting?: ColumnSort;
  route: string;
  pageSize?: number;
}

export function dataType(a: any) {
  if (Number.isInteger(a)) return FilterTypeCategories.Numeric;
  if (isDate(a)) return FilterTypeCategories.Date;
  if (typeof a === 'string') return FilterTypeCategories.String;
  if (typeof a === 'boolean') return FilterTypeCategories.Boolean;
  return typeof a;
}

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
        ? b?.trim().toLowerCase()?.localeCompare?.(a?.trim().toLowerCase())
        : a
            .trim()
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare?.(b?.trim()?.toLowerCase());
    default:
      return -1;
  }
}

function applySearch<T>(items: T[], filters: Filter[], searchInput: string) {
  if (searchInput.length === 0 || !filters.length) return items;

  return items?.filter((item) =>
    filters?.some(({ key }) => {
      const value = (item as any)[key];
      if (value === null || value === undefined) return false;
      return value
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchInput?.toLowerCase());
    }),
  );
}

export function useResourcesV6<T extends Record<string, unknown>>({
  route,
  queryKey,
  queryFn,
  refetchInterval,
  pageSize = 10,
  columns = [],
  defaultSorting,
}: ResourcesV6Params<T>) {
  const [searchInput, setSearchInput] = useState('');
  const [searchFilters, setSearchFilters] = useState<Filter[]>([]);
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey],
    queryFn: queryFn ? () => queryFn(route) : () => v6.get(route),
    refetchInterval: refetchInterval || false,
    retry: false,
  });

  const [sorting, setSorting] = useState<ColumnSort | undefined>(
    defaultSorting,
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return applyFilters(
      applySearch(data?.data, searchFilters, searchInput),
      filters,
    );
  }, [searchFilters, data?.data, filters]);

  const filteredAndSortedData = useMemo(() => {
    if (sorting) {
      const columnType =
        columns.find((col) => col.id === sorting.id)?.type ||
        FilterTypeCategories.String;
      return [...filteredData].sort((a, b) =>
        sortColumn(
          columnType,
          `${a?.[sorting.id]}`,
          `${b?.[sorting.id]}`,
          sorting.desc,
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

  const onSearch = useCallback(
    (search: string | undefined) => {
      setSearchInput(search || '');
      setSearchFilters(
        !search
          ? []
          : searchableColumns.map(({ id }) => ({
              key: id,
              value: search,
              comparator: FilterComparator.Includes,
            })),
      );
    },
    [searchableColumns],
  );

  return {
    data,
    sorting,
    setSorting,
    pageIndex,
    totalCount,
    flattenData: flattenData?.slice(0, (pageIndex + 1) * pageSize),
    isError,
    isLoading,
    hasNextPage: pageIndex * pageSize + pageSize < flattenData?.length,
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
