import { useState, useEffect, useMemo, useCallback } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../ports/use-data-api/useDataApi.types';
import { useDataRetrievalOperations } from '../../utils/data-retrieval-operations/useDataRetrievalOperations';
import { useQuery } from '../../infra/tanstack/use-query';
import { ResourcesV6Params, FetchV6Result } from './v6.type';
import { useFilterAndSortData } from './filter-and-sort-data/useFilterAndSortData';

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

  const { data, error, isError, isFetching, isLoading, isSuccess, status } =
    useQuery<FetchV6Result<TData>>({
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
    if (!isLoading) {
      setTotalCount(filteredAndSortedData.length);
      setPageIndex(0);
      setFlattenData(filteredAndSortedData as TData[]);
    }
  }, [filteredAndSortedData]);

  const fetchNextPage = useCallback(
    () => setPageIndex((previousPageIndex) => previousPageIndex + 1),
    [pageIndex],
  );

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
};
