import { useState, useEffect, useMemo, useCallback } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../useDataApi.types';
import { useDataRetrievalOperations } from '../../utils/data-retrieval-operations/useDataRetrievalOperations';
import { useQuery } from '../../adapters/use-query';
import { ResourcesV6Params, FetchV6Result } from './v6.type';
import { useFilterAndSortData } from './filter-and-sort-data/useFilterAndSortData';

export const useV6 = <TData = unknown, TColumn = unknown>({
  route = '',
  queryKey,
  queryFn,
  refetchInterval,
  pageSize = 10,
  columns = [],
  defaultSorting,
  enabled = true,
}: ResourcesV6Params<TData, TColumn>): UseDataApiResult<TData> => {
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
  } = useDataRetrievalOperations<TColumn>({ defaultSorting, columns });
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<TData[]>([]);

  const { data, isLoading, ...rest } = useQuery<FetchV6Result<TData>>({
    queryKey: [queryKey],
    queryFn: queryFn ? () => queryFn(route) : () => v6.get(route),
    refetchInterval: refetchInterval || false,
    enabled,
    retry: false,
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
    data: { data: filteredAndSortedData },
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
    ...rest,
  };
};
