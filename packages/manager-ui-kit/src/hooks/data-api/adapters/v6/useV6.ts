import React, { useCallback, useEffect, useState } from 'react';

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
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<TData[]>([]);

  const { data, error, isError, isFetching, isLoading, isSuccess, status } = useQuery<
    FetchV6Result<TData>
  >({
    cacheKey: [cacheKey],
    fetchDataFn: () => {
      return fetchDataFn ? fetchDataFn(route) : v6.get(route);
    },
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

  useEffect(() => {
    if (!isLoading && enabled) {
      setTotalCount(filteredAndSortedData.length);
      setPageIndex(0);
      setFlattenData(filteredAndSortedData);
    }
  }, [filteredAndSortedData, isLoading, enabled]);

  const fetchNextPage = useCallback(
    () => setPageIndex((previousPageIndex) => previousPageIndex + 1),
    [],
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

  return {
    error,
    isError,
    isFetching,
    isSuccess,
    status,
    isLoading,
    pageIndex,
    totalCount,
    flattenData: flattenData?.slice(0, (pageIndex + 1) * pageSize),
    hasNextPage: pageIndex * pageSize + pageSize < flattenData?.length,
    fetchNextPage,
    sorting: {
      sorting: sorting ?? [],
      setSorting: ((value) =>
        setSorting(
          typeof value === 'function' ? (prev) => value(prev ?? []) : (value ?? []),
        )) as React.Dispatch<React.SetStateAction<SortingState>>,
      manualSorting: true,
    },
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
};
