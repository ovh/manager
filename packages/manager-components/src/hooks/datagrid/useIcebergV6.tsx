import { useState, useEffect } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';

interface IcebergV6Hook {
  queryKey: string;
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
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

function useResourcesIcebergV6({
  route,
  pageSize = 10,
  queryKey,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState([]);
  const [sorting, setSorting] = useState<any>({});
  const queryClient = useQueryClient();

  // console.info('useResourcesIcebergV6 sorting : ', sorting);

  const resetInfiniteQuery = () => {
    // Invalidate the query to refetch the data
    queryClient.invalidateQueries({
      queryKey: [queryKey],
      refetchType: 'none',
    });
  };

  const {
    data,
    fetchNextPage,
    isError,
    isLoading,
    error,
    status,
  } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [queryKey],
    queryFn: () =>
      getResourcesIcebergV6({
        route,
        pageSize,
        page: pageIndex,
        sortBy: sorting?.id,
        sortReverse: sorting?.desc || null,
      }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: () => totalCount / pageSize >= pageIndex,
  });

  useEffect(() => {
    if (data && data?.pages && data?.pages?.length > 0) {
      setTotalCount(data.pages[0]?.totalCount);
    }
  }, [data]);

  const goNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten);
  }, [data]);

  useEffect(() => {
    if (pageIndex > 0) {
      // console.info('entre dans la condition 1 !');
      fetchNextPage();
    }
  }, [pageIndex]);

  useEffect(() => {
    setPageIndex(1);
    resetInfiniteQuery();
  }, [sorting]);

  return {
    data,
    flattenData,
    goNextPage,
    pageIndex,
    hasNextPage: totalCount / pageSize > pageIndex,
    totalCount,
    isError,
    error,
    isLoading,
    status,
    sorting,
    setSorting,
  };
}

function useResourcesIcebergV62({
  route,
  pageSize = 10,
  queryKey,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState([]);
  const [sorting, setSorting] = useState<any>({});

  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey, pageIndex, sorting],
    queryFn: () =>
      getResourcesIcebergV6({
        route,
        pageSize,
        page: pageIndex,
        sortBy: sorting?.id,
        sortReverse: sorting?.desc || null,
      }),
    // staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    setFlattenData([]);
    setPageIndex(1);
  }, [sorting]);

  useEffect(() => {
    if (data && data?.totalCount) {
      setTotalCount(data.totalCount);
    }
  }, [data]);

  useEffect(() => {
    if (data && data?.totalCount) {
      setFlattenData((dataPrevious) => [...dataPrevious, ...data.data]);
    }
  }, [data]);

  const onFetchNextPage = () => {
    console.info('onFetchNextPage !');
    setPageIndex(pageIndex + 1);
  };

  return {
    data,
    onFetchNextPage,
    setFlattenData,
    flattenData,
    pageIndex,
    hasNextPage: totalCount / pageSize > pageIndex,
    totalCount,
    isError,
    error,
    isLoading,
    status,
    sorting,
    setSorting,
  };
}

export { useResourcesIcebergV62, useResourcesIcebergV6 };
