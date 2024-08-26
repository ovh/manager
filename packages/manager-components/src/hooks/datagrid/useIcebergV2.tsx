import { useEffect, useState } from 'react';
import { IcebergFetchParamsV2, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';

interface IcebergV2Hook<T> {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  sort?: (sorting: ColumnSort, data: T[]) => T[];
}

export const getResourcesIcebergV2 = async ({
  route,
  pageSize,
  cursor,
}: {
  route: string;
  pageSize: number;
  cursor?: string;
}) => {
  const { data, status, cursorNext } = await fetchIcebergV2({
    route,
    pageSize,
    cursor,
  });
  return { data, status, cursorNext };
};

export function useResourcesIcebergV2<T = unknown>({
  route,
  pageSize = 10,
  queryKey,
  defaultSorting = undefined,
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
    queryKey,
    queryFn: ({ pageParam }) =>
      getResourcesIcebergV2({ route, pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = data?.pages.map((page) => page.data).flat() as T[];
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
