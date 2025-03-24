import React, { useEffect, useState } from 'react';
import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { defaultPageSize } from './index';
import { ColumnSort } from '../../components';

export type UseResourcesIcebergV2Result<T> = {
  data: InfiniteData<IcebergFetchResultV2<T>, unknown>;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<IcebergFetchResultV2<T>, unknown>,
      Error
    >
  >;
  hasNextPage: boolean;
  flattenData: T[];
  isError: boolean;
  isLoading: boolean;
  setSorting: React.Dispatch<React.SetStateAction<ColumnSort>>;
  sorting: ColumnSort;
  error: Error;
  status: 'error' | 'success' | 'pending';
};

interface IcebergV2Hook<T> {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
  shouldFetchAll?: boolean;
}

export const API_V2_MAX_PAGE_SIZE = 9999;

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = fetchIcebergV2;

export function useResourcesIcebergV2<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
}: IcebergFetchParamsV2 & IcebergV2Hook<T>): UseResourcesIcebergV2Result<T> {
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [...queryKey, shouldFetchAll ? 'all' : ''].filter(Boolean),
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<T>({
        route,
        pageSize: shouldFetchAll ? API_V2_MAX_PAGE_SIZE : pageSize,
        cursor: pageParam,
      }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = data?.pages.map((page) => page.data).flat() as T[];
    setFlattenData(flatten);

    // fetch next page if needed
    if (shouldFetchAll && hasNextPage) {
      fetchNextPage();
    }
  }, [data]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    flattenData,
    isError,
    isLoading,
    setSorting,
    sorting,
    error,
    status,
  };
}
