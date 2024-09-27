import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';
import { IcebergFetchParamsV2 } from '../useCoreApiClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';

interface IcebergV2Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
}

export const defaultPageSize = 10;

/**
 * @deprecated use fetchIcebergV2 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV2 = () => {
  const context = useContext(ManagerReactComponentContext);
  const { iceberg } = context;
  return iceberg.fetchIcebergV2;
};

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
