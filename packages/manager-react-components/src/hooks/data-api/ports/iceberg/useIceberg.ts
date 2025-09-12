import { useEffect } from 'react';
import { fetchWithIceberg, IcebergFetchResult } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../useDataApi.types';
import {
  useInfiniteQuery,
  InfiniteData,
  DefinedUseInfiniteQueryResult,
} from '../../adapters/use-infinite-query';
import { DEFAULT_PAGE_SIZE } from '../../useDataApi.constants';
import { useDataRetrievalOperations } from '../../utils/data-retrieval-operations/useDataRetrievalOperations';
import { UseIcebergParams, SelectData } from './useIceberg.type';
import { API_V6_MAX_PAGE_SIZE } from './useIceberg.constants';

export const useIceberg = <TData = unknown, TColumn = unknown>({
  version = 'v6',
  route = '',
  pageSize = DEFAULT_PAGE_SIZE,
  queryKey,
  defaultSorting = undefined,
  fetchAll = false,
  columns = [],
  disableCache,
  enabled = true,
}: UseIcebergParams<TColumn>): UseDataApiResult<TData> => {
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

  const {
    data: dataSelected,
    hasNextPage,
    fetchNextPage,
    ...rest
  }: DefinedUseInfiniteQueryResult<SelectData<TData>> = useInfiniteQuery<
    IcebergFetchResult<TData>,
    Error,
    SelectData<TData>,
    string[],
    number
  >({
    initialPageParam: 1,
    queryKey: [
      ...(typeof queryKey === 'string' ? [queryKey] : queryKey),
      fetchAll ? 'all' : pageSize,
      sorting,
      filters,
      searchFilters,
    ],
    staleTime: Infinity,
    retry: false,
    enabled,
    queryFn: ({ pageParam: pageIndex }): Promise<IcebergFetchResult<TData>> =>
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
      _allPages,
      lastPageIndex: number,
    ): number | null => {
      if (lastPage.totalCount / pageSize > lastPageIndex) {
        return lastPageIndex + 1;
      }
      return null;
    },
    select: (
      data: InfiniteData<IcebergFetchResult<TData>>,
    ): SelectData<TData> => {
      const pageIndex = data.pageParams[data.pageParams.length - 1] as number;
      const { totalCount } = data.pages[0] as IcebergFetchResult<TData>;
      return {
        data,
        pageIndex,
        totalCount,
        flattenData: data.pages.flatMap((page) => page.data),
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
