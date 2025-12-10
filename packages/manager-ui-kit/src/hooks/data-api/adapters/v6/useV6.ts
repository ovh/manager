import React, { useCallback, useMemo, useState } from 'react';

import type { SortingState } from '@tanstack/react-table';

import { v6 } from '@ovh-ux/manager-core-api';

import { useQuery } from '@/hooks/data-api/infra/tanstack';
import { DEFAULT_DATA_API_RESPONSE } from '@/hooks/data-api/ports/useDataApi.constants';
import { UseDataApiResult } from '@/hooks/data-api/ports/useDataApi.types';
import { useDataRetrievalOperations } from '@/hooks/data-api/useDataRetrievalOperations';

import { useFilterAndSortData } from './filter-and-sort-data/useFilterAndSortData';
import { FetchV6Result, ResourcesV6Params } from './v6.type';

export const useV6 = <TData = Record<string, unknown>>({
  route = '',
  cacheKey,
  fetchDataFn,
  refetchInterval,
  pageSize = 10,
  columns = [],
  defaultSorting,
  enabled = true,
}: ResourcesV6Params<TData>): UseDataApiResult<TData> => {
  const {
    searchInput,
    setSearchInput,
    searchFilters,
    sorting,
    setSorting,
    filters,
    addFilter,
    removeFilter,
    onSearch,
  } = useDataRetrievalOperations<TData>({ defaultSorting, columns });

  const [pageIndex, setPageIndex] = useState(0);

  const { data, error, isError, isFetching, isLoading, isSuccess, status } = useQuery<
    FetchV6Result<TData>
  >({
    cacheKey: [cacheKey],
    fetchDataFn: () => (fetchDataFn ? fetchDataFn(route) : v6.get(route)),
    refetchInterval: refetchInterval || false,
    enabled,
  });

  const { filteredAndSortedData } = useFilterAndSortData({
    items: data?.data,
    columns,
    filters,
    searchFilters,
    sorting,
  });

  const flattenData = useMemo(
    () => (enabled && !isLoading ? filteredAndSortedData : []),
    [enabled, isLoading, filteredAndSortedData],
  );

  const totalCount = flattenData.length;

  const fetchNextPage = useCallback(() => {
    setPageIndex((previousPageIndex) => previousPageIndex + 1);
  }, []);

  const setSortingWithReset = useCallback(
    (value: React.SetStateAction<SortingState>) => {
      setPageIndex(0);
      setSorting(typeof value === 'function' ? (prev) => value(prev ?? []) : (value ?? []));
    },
    [setSorting],
  );

  const addFilterWithReset = useCallback(
    (...args: Parameters<typeof addFilter>) => {
      setPageIndex(0);
      addFilter(...args);
    },
    [addFilter],
  );

  const removeFilterWithReset = useCallback(
    (...args: Parameters<typeof removeFilter>) => {
      setPageIndex(0);
      removeFilter(...args);
    },
    [removeFilter],
  );

  const onSearchWithReset = useCallback(
    (...args: Parameters<typeof onSearch>) => {
      setPageIndex(0);
      onSearch(...args);
    },
    [onSearch],
  );

  const setSearchInputWithReset = useCallback(
    (...args: Parameters<typeof setSearchInput>) => {
      setPageIndex(0);
      setSearchInput(...args);
    },
    [setSearchInput],
  );

  if (!enabled) {
    return {
      ...DEFAULT_DATA_API_RESPONSE,
      sorting: {
        sorting: [],
        setSorting: () => {},
        manualSorting: false,
      },
    };
  }

  const pagedData = flattenData.slice(0, (pageIndex + 1) * pageSize);

  return {
    error,
    isError,
    isFetching,
    isSuccess,
    status,
    isLoading,
    pageIndex,
    totalCount,
    flattenData: pagedData,
    hasNextPage: pageIndex * pageSize + pageSize < flattenData.length,
    fetchNextPage,
    sorting: {
      sorting: sorting ?? [],
      setSorting: setSortingWithReset as React.Dispatch<React.SetStateAction<SortingState>>,
      manualSorting: true,
    },
    filters: {
      filters,
      add: addFilterWithReset,
      remove: removeFilterWithReset,
    },
    search: {
      onSearch: onSearchWithReset,
      searchInput,
      setSearchInput: setSearchInputWithReset,
    },
  };
};
