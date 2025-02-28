import React, { useState, useEffect, useMemo, useCallback } from 'react';
import isDate from 'lodash.isdate';
import {
  IcebergFetchParamsV6,
  fetchIcebergV6,
  applyFilters,
  FilterTypeCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { useColumnFilters, ColumnSort } from '../../components';

export interface ColumnDatagrid {
  cell: (props: any) => React.JSX.Element;
  id: string;
  label: string;
  type: string;
  isSearchable?: boolean;
}

export interface ResourcesV6Hook {
  queryKey: string[];
  columns: ColumnDatagrid[];
}

export function dataType(a) {
  if (Number.isInteger(a)) return FilterTypeCategories.Numeric;
  if (isDate(a)) return FilterTypeCategories.Date;
  if (typeof a === 'string') return FilterTypeCategories.String;
  if (typeof a === 'boolean') return FilterTypeCategories.Boolean;
  return typeof a;
}

function sortColumn(type: string, a: any, b: any, desc: boolean) {
  if (!a || !b) return -1;
  switch (type) {
    case FilterTypeCategories.Numeric:
      return desc
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a);
    case FilterTypeCategories.Date:
      return desc
        ? new Date(a).getTime() - new Date(b).getTime()
        : new Date(b).getTime() - new Date(a).getTime();
    case FilterTypeCategories.Boolean:
      return desc ? Number(a) - Number(b) : Number(b) - Number(a);
    case FilterTypeCategories.String:
      return desc
        ? a
            ?.trim()
            .toLowerCase()
            ?.localeCompare?.(b?.trim().toLowerCase())
        : b
            .trim()
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare?.(a?.trim()?.toLowerCase());
    default:
      return -1;
  }
}

function applySearch(items, filters) {
  if (!filters?.length) return items;
  return items.filter((item) =>
    filters.some(
      ({ key, value }) =>
        item[key]?.toString()?.toLowerCase().includes(value.toLowerCase()),
    ),
  );
}

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesV6 = fetchIcebergV6;

export function useResourcesV6<T = unknown>({
  route,
  queryKey,
  pageSize = 10,
  columns = [],
}: IcebergFetchParamsV6 & ResourcesV6Hook) {
  const [searchInput, setSearchInput] = useState('');
  const [searchFilter, setSearchFilter] = useState<any>(null);
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchIcebergV6<T>({ route }),
    retry: false,
  });
  const [sorting, setSorting] = useState<ColumnSort>();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const searchedData = useMemo(
    () => (!searchFilter ? data?.data : applySearch(data?.data, searchFilter)),
    [searchFilter, data?.data],
  );

  const filteredData = useMemo(
    () => (!filters ? searchedData : applyFilters(searchedData, filters)),
    [filters, searchedData],
  );

  const sortedData = useMemo(() => {
    if (sorting) {
      const columnType = columns.find((col) => col.id === sorting.id)?.type;
      const array = filteredData.length > 0 ? filteredData : data?.data;
      return [...array].sort((a, b) =>
        sortColumn(columnType, a?.[sorting.id], b?.[sorting.id], sorting.desc),
      );
    }
    return filteredData.length > 0 ? filteredData : data?.data;
  }, [sorting, filteredData]);

  useEffect(() => {
    if (data?.data && data?.data?.length > 0 && totalCount === 0) {
      setTotalCount(data.data.length);
      setFlattenData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    setPageIndex(0);
    setFlattenData(sortedData);
  }, [sortedData]);

  const fetchNextPage = useCallback(() => setPageIndex((prev) => prev + 1), []);

  const searchableColumns = useMemo(
    () => columns.filter((col: ColumnDatagrid) => col.isSearchable),
    [columns],
  );

  const onSearch = useCallback((search) => {
    setSearchFilter(
      !search
        ? null
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
