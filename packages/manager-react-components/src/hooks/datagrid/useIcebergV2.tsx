import { useEffect, useState, useContext } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ManagerReactComponentContext } from '../../context/ManagerReactComponentsContext';
import { IcebergFetchParamsV2 } from '../useCoreApiClient';
import { ColumnSort } from '../../components';

interface IcebergV2Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
}

export const defaultPageSize = 10;

export function useResourcesIcebergV2<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
}: IcebergFetchParamsV2 & IcebergV2Hook) {
  const context = useContext(ManagerReactComponentContext);
  const { iceberg } = context;
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
      iceberg.fetchIcebergV2<T>({ route, pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext,
  });

  useEffect(() => {
    const flatten = data?.pages.map((page) => page.data).flat();
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
