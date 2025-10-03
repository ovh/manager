import { useEffect } from 'react';
import { fetchWithIceberg, IcebergFetchResult } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../ports/use-data-api/useDataApi.types';
import {
  useInfiniteQuery,
  UseInifiniteQueryResult,
} from '../../infra/tanstack/use-infinite-query';
import { DEFAULT_PAGE_SIZE } from '../../ports/use-data-api/useDataApi.constants';
import { useDataRetrievalOperations } from '../../utils/data-retrieval-operations/useDataRetrievalOperations';
import { UseIcebergParams, UseIcebergData } from './useIceberg.type';
import { API_V6_MAX_PAGE_SIZE } from './useIceberg.constants';

export const useIceberg = <TData = Record<string, unknown>>({
  version = 'v6',
  route = '',
  pageSize = DEFAULT_PAGE_SIZE,
  cacheKey,
  defaultSorting = undefined,
  fetchAll = false,
  columns = [],
  disableCache,
  enabled = true,
}: UseIcebergParams<TData>): UseDataApiResult<TData> => {
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

  const {
    data: dataSelected,
    hasNextPage,
    fetchNextPage,
    ...rest
  }: UseInifiniteQueryResult<UseIcebergData<TData>> = useInfiniteQuery<
    IcebergFetchResult<TData>,
    Error,
    UseIcebergData<TData>,
    string[],
    number
  >({
    initialPageParam: 1,
    cacheKey: [
      ...(typeof cacheKey === 'string' ? [cacheKey] : cacheKey),
      fetchAll ? 'all' : pageSize,
      sorting,
      filters,
      searchFilters,
    ],
    enabled,
    fetchDataFn: ({
      pageParam: pageIndex,
    }): Promise<IcebergFetchResult<TData>> =>
      fetchWithIceberg<TData>({
        version,
        route,
        pageSize: fetchAll ? API_V6_MAX_PAGE_SIZE : pageSize,
        ...(typeof pageIndex === 'number' && { page: pageIndex }),
        sortBy: sorting?.id,
        sortOrder: sorting?.desc ? 'DESC' : 'ASC',
        filters: searchFilters ? [...searchFilters, ...filters] : filters,
        disableCache,
      }),
    getNextPageParam: (
      lastPage: IcebergFetchResult<TData>,
      lastPageIndex: number,
    ): number | null => {
      if (lastPage.totalCount / pageSize > lastPageIndex) {
        return lastPageIndex + 1;
      }
      return null;
    },
    transformFn: (pages, pageParams): UseIcebergData<TData> => {
      const pageIndex = pageParams[pageParams.length - 1] as number;
      const { totalCount } = pages[0] as IcebergFetchResult<TData>;
      return {
        pageIndex,
        totalCount,
        flattenData: pages.flatMap((page) => page.data),
      };
    },
  });

  useEffect(() => {
    if (fetchAll && hasNextPage) {
      fetchNextPage();
    }
  }, [dataSelected]);

  return {
    ...(dataSelected && { ...dataSelected }),
    hasNextPage,
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
