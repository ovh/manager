import { useEffect, useState } from 'react';
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

export const API_V2_MAX_PAGE_SIZE = 9999;

interface IcebergV2Hook<T> {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
  shouldFetchAll?: boolean;
}

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = fetchIcebergV2;

/**
 * @deprecated use useIcebergV2InfiniteQuery
 */
export function useResourcesIcebergV2<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
}: IcebergFetchParamsV2 & IcebergV2Hook<T>) {
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

type UseIcebergV2InfiniteQueryParams<T> = {
  iceberg: Omit<IcebergFetchParamsV2, 'cursor'>;
  query: Omit<
    UseInfiniteQueryOptions,
    'queryFn' | 'getNextPageParam' | 'initialPageParam'
  > & {
    select?: (data: InfiniteData<T, unknown>) => T[];
  };
  shouldFetchAll?: boolean;
};

export function useIcebergV2InfiniteQuery<T>({
  iceberg: { pageSize, search, ...icebergOptions },
  query: { queryKey, ...queryOptions },
  shouldFetchAll = false,
}: UseIcebergV2InfiniteQueryParams<T>) {
  const query = useInfiniteQuery({
    // return only flattened data without cursor by default to avoid
    // unwanted rerenders on refetch if data is the same
    select: (data) =>
      data?.pages?.flatMap((page: UseInfiniteQueryResult<T>) => page?.data),
    ...queryOptions,
    initialPageParam: null,
    queryKey: [
      ...queryKey,
      shouldFetchAll,
      search ? `${search.key}=${search.value}` : '',
    ].filter(Boolean),
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<T>({
        pageSize:
          pageSize || (shouldFetchAll ? API_V2_MAX_PAGE_SIZE : defaultPageSize),
        cursor: pageParam as string,
        search,
        ...icebergOptions,
      }),
    getNextPageParam: (lastPage: IcebergFetchResultV2<T>) =>
      lastPage.cursorNext,
  });

  useEffect(() => {
    // fetch next page if needed
    if (shouldFetchAll && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query.data]);

  return query;
}
