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
    setSearchInput: setSearchInputBase,
    searchFilters,
    sorting,
    setSorting: setSortingBase,
    filters,
    addFilter: addFilterBase,
    removeFilter: removeFilterBase,
    onSearch: onSearchBase,
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

  const setSorting = useCallback(
    (value: React.SetStateAction<SortingState>) => {
      setPageIndex(0);
      setSortingBase(typeof value === 'function' ? (prev) => value(prev ?? []) : (value ?? []));
    },
    [setSortingBase],
  );

  const addFilter = useCallback(
    (...args: Parameters<typeof addFilterBase>) => {
      setPageIndex(0);
      addFilterBase(...args);
    },
    [addFilterBase],
  );

  const removeFilter = useCallback(
    (...args: Parameters<typeof removeFilterBase>) => {
      setPageIndex(0);
      removeFilterBase(...args);
    },
    [removeFilterBase],
  );

  const onSearch = useCallback(
    (...args: Parameters<typeof onSearchBase>) => {
      setPageIndex(0);
      onSearchBase(...args);
    },
    [onSearchBase],
  );

  const setSearchInput = useCallback(
    (...args: Parameters<typeof setSearchInputBase>) => {
      setPageIndex(0);
      setSearchInputBase(...args);
    },
    [setSearchInputBase],
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
      setSorting: setSorting as React.Dispatch<React.SetStateAction<SortingState>>,
      manualSorting: true,
    },
    filters: {
      filters,
      add: addFilter,
      remove: removeFilter,
    },
    search: {
      onSearch: onSearch,
      searchInput,
      setSearchInput: setSearchInput,
    },
  };
};
