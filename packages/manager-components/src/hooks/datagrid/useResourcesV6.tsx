import { useState, useEffect } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

interface ResourcesV6Hook {
  queryKey: string;
}

export const getResourcesV6 = async ({ route }: IcebergFetchParamsV6) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

function useResourcesV6({
  route,
  queryKey,
  pageSize = 10,
}: IcebergFetchParamsV6 & ResourcesV6Hook) {
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getResourcesV6({
        route,
      }),
    retry: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [flattenData, setFlattenData] = useState([]);

  useEffect(() => {
    if (data && data?.data && data?.data?.length > 0) {
      setTotalCount(data.data.length);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data) {
      const currentPosition = pageIndex * pageSize;
      const slice = data?.data.slice(
        currentPosition,
        currentPosition + pageSize,
      );
      setFlattenData([...flattenData, ...slice]);
    }
  }, [pageIndex, data]);

  const onFetchNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  return {
    data,
    sorting,
    setSorting,
    pageIndex,
    totalCount,
    flattenData,
    isError,
    isLoading,
    hasNextPage: pageIndex * pageSize + pageSize <= totalCount,
    onFetchNextPage,
    error,
    status,
  };
}

export default useResourcesV6;
