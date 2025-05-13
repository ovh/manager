import React, { useEffect, useState } from 'react';
import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { defaultPageSize } from './index';
import { ColumnSort } from '../../components';

export type UseResourcesIcebergV2Result<T> = {
  flattenData: T[];
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort>>;
  sorting: ColumnSort;
} & UseInfiniteQueryResult<InfiniteData<IcebergFetchResultV2<T>>, Error>;

export type IcebergV2HookParams<T> = {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
  shouldFetchAll?: boolean;
} & Omit<
  UseInfiniteQueryOptions<IcebergFetchResultV2<T>>,
  // select needs to be omitted because of flattenData
  // @TODO: deprecate flattenData and let user do it via select
  'queryFn' | 'getNextPageParam' | 'initialPageParam' | 'select'
>;

export const API_V2_MAX_PAGE_SIZE = 9999;

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = fetchIcebergV2;

export function useResourcesIcebergV2<T>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
  ...options
}: IcebergFetchParamsV2 &
  IcebergV2HookParams<T>): UseResourcesIcebergV2Result<T> {
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);

  const query = useInfiniteQuery({
    staleTime: Infinity,
    retry: false,
    ...options,
    initialPageParam: null,
    queryKey: [...queryKey, shouldFetchAll ? 'all' : ''].filter(Boolean),
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<T>({
        route,
        pageSize: shouldFetchAll ? API_V2_MAX_PAGE_SIZE : pageSize,
        cursor: pageParam as string,
      }),
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = query.data?.pages.flatMap((page) => page.data);
    setFlattenData(flatten);

    // fetch next page if needed
    if (shouldFetchAll && query.hasNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return {
    ...query,
    flattenData,
    setSorting,
    sorting,
  };
}
