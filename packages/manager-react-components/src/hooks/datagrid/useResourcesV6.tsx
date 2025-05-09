import React, { useState, useEffect, useMemo, useCallback } from 'react';
import isDate from 'lodash.isdate';
import {
  IcebergFetchParamsV6,
  fetchIcebergV6,
  applyFilters,
  FilterTypeCategories,
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

function applySearch(items, filters, searchInput) {
  if (!searchInput || searchInput.length === 0 || !filters?.length)
    return items;

  return items?.filter(
    (item) =>
      filters?.some((columnId) => {
        const value = item[columnId];
        if (value === null || value === undefined) return false;
        return value
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchInput?.toLowerCase());
      }),
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
  const [searchSubmitted, setSearchSubmitted] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
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

  const searchableColumns = useMemo(() => {
    return columns
      .filter((col: ColumnDatagrid) => col.isSearchable)
      .map((filter) => filter?.id);
  }, [columns]);

  const searchedData = useMemo(() => {
    if (!data?.data) return [];
    let processedData = data?.data;

    if (searchSubmitted) {
      processedData = applySearch(
        data?.data,
        searchableColumns,
        searchSubmitted,
      );
    }
    if (filters) {
      processedData = applyFilters(processedData, filters);
    }
    return processedData;
  }, [searchableColumns, searchSubmitted, data?.data, filters]);

  const sortedData = useMemo(() => {
    if (sorting) {
      const columnType = columns.find((col) => col.id === sorting.id)?.type;
      const array = searchedData.length > 0 ? searchedData : data?.data;
      return [...array].sort((a, b) =>
        sortColumn(columnType, a?.[sorting.id], b?.[sorting.id], sorting.desc),
      );
    }
    return searchedData.length > 0 ? searchedData : [];
  }, [sorting, searchedData]);

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

  const onSearch = useCallback((search) => {
    setSearchSubmitted(search.trim());
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
