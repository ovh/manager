import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';
import { IcebergFetchParamsV6 } from '../useCoreApiClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';

interface IcebergV6Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
}

interface QueryParams {
  pageIndex: number;
  sorting?: ColumnSort;
}

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV6 = () => {
  const context = useContext(ManagerReactComponentContext);
  return context.iceberg.fetchIcebergV6;
};

export function useResourcesIcebergV6<T = unknown>({
  route,
  pageSize = 10,
  queryKey,
  defaultSorting = undefined,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const context = useContext(ManagerReactComponentContext);
  const { iceberg } = context;
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pageIndex: 1,
    sorting: { desc: false, id: '' },
  });
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);

  const { data, fetchNextPage, isError, isLoading, error, status } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [...queryKey, sorting],
      queryFn: ({ pageParam }) =>
        iceberg.fetchIcebergV6<T>({
          route,
          pageSize,
          page: pageParam,
          sortBy: sorting?.id || null,
          sortReverse: sorting?.desc,
        }),
      staleTime: Infinity,
      retry: false,
      getNextPageParam: () => queryParams.pageIndex,
    });

  useEffect(() => {
    const flatten = data?.pages.map((page) => page.data).flat();
    setFlattenData(flatten);
  }, [data]);

  useEffect(() => {
    if (totalCount === 0 && data?.pages) {
      setTotalCount(data.pages[0].totalCount);
    }
  }, [data]);

  useEffect(() => {
    if (sorting) {
      setQueryParams(() => ({ pageIndex: 1, sorting }));
    }
  }, [sorting]);

  useEffect(() => {
    fetchNextPage();
  }, [queryParams]);

  const onFetchNextPage = () => {
    setQueryParams((previousParams: QueryParams) => ({
      ...previousParams,
      pageIndex: previousParams.pageIndex + 1,
    }));
  };

  return {
    data,
    fetchNextPage: onFetchNextPage,
    setFlattenData,
    flattenData,
    totalCount,
    pageIndex: queryParams.pageIndex,
    hasNextPage: totalCount / pageSize > queryParams.pageIndex,
    isError,
    error,
    isLoading,
    status,
    sorting,
    setSorting,
  };
}
