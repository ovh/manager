import { useState, useEffect } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
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

export const getResourcesIcebergV6 = async ({
  route,
  pageSize,
  page,
  sortBy,
  sortReverse,
}: IcebergFetchParamsV6) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route,
    pageSize,
    page,
    sortBy,
    sortReverse,
  });
  return { data, status, totalCount };
};

export function useResourcesIcebergV6({
  route,
  pageSize = 10,
  queryKey,
  defaultSorting = undefined,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState([]);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    pageIndex: 1,
    sorting: { desc: false, id: '' },
  });
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);

  const {
    data,
    fetchNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [...queryKey, sorting],
    queryFn: ({ pageParam }) =>
      getResourcesIcebergV6({
        route,
        pageSize,
        page: pageParam,
        sortBy: sorting?.id || null,
        sortReverse: sorting?.desc,
      }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: () => {
      return queryParams.pageIndex;
    },
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
