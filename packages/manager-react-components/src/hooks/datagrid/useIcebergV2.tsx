import { useEffect, useState } from 'react';
import {
  IcebergFetchParamsV2,
  IcebergFetchResultV2,
  fetchIcebergV2,
} from '@ovh-ux/manager-core-api';
import { Query, useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';

interface IcebergV2Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  refetchInterval?:
    | number
    | false
    | ((query: Query) => number | false | undefined);
}

export const defaultPageSize = 10;

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = fetchIcebergV2;

export function useResourcesIcebergV2<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  refetchInterval = false,
}: IcebergFetchParamsV2 & IcebergV2Hook) {
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
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchIcebergV2<T>({ route, pageSize, cursor: pageParam }),
    staleTime: Infinity,
    refetchInterval,
    retry: false,
    getNextPageParam: (lastPage: IcebergFetchResultV2<T>) =>
      lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = data?.pages
      .map((page: IcebergFetchResultV2<T>) => page.data)
      .flat();
    setFlattenData(flatten);
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
