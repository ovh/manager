import { useState, useEffect } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';

interface IcebergV6Hook {
  queryKey: string;
}

export const getResourcesIcebergV6 = async ({
  route,
  pageSize,
  page,
}: IcebergFetchParamsV6) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route,
    pageSize,
    page,
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
  const {
    data,
    fetchNextPage,
    isError,
    isLoading,
    error,
    status,
  }: any = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [queryKey],
    queryFn: () =>
      getResourcesIcebergV6({
        route,
        pageSize,
        page: pageIndex,
      }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: () => totalCount / 10 >= pageIndex,
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
    if (pageIndex > 1) {
      fetchNextPage();
    }
  }, [pageIndex]);

  return {
    data,
    flattenData,
    goNextPage,
    pageIndex,
    hasNextPage: totalCount / 10 >= pageIndex,
    totalCount,
    isError,
    error,
    isLoading,
    status,
  };
}

export default useResourcesIcebergV6;
