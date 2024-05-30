import { useEffect, useState } from 'react';
import { IcebergFetchParamsV2, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';

interface IcebergV2Hook {
  queryKey: string;
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
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};

function useResourcesIcebergV2({
  route,
  pageSize = 10,
  queryKey,
}: IcebergFetchParamsV2 & IcebergV2Hook) {
  const [flattenData, setFlattenData] = useState([]);
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
    queryKey: [queryKey],
    queryFn: ({ pageParam }) =>
      getResourcesIcebergV2({ route, pageSize, cursor: pageParam }),
    staleTime: Infinity,
    retry: false,
    getNextPageParam: (lastPage) => lastPage.cursorNext as any,
  });

  useEffect(() => {
    const flatten = data?.pages.map((page: any) => page.data).flat();
    setFlattenData(flatten);
  }, [data]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    flattenData,
    isError,
    isLoading,
    error,
    status,
  };
}

export default useResourcesIcebergV2;
