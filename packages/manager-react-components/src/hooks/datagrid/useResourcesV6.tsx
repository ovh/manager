import React, { useState, useEffect } from 'react';
import isDate from 'lodash.isdate';
import { useQuery } from '@tanstack/react-query';
import { IcebergFetchParamsV6 } from '../useCoreApiClient';
import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';
import { ColumnSort } from '../../components';

export interface ColumnDatagrid {
  cell: (props: any) => React.JSX.Element;
  id: string;
  label: string;
  type: string;
}

interface ResourcesV6Hook {
  queryKey: string[];
  columns?: ColumnDatagrid[];
}

export function dataType(a: any) {
  if (Number.isInteger(a)) return 'number';
  if (isDate(a)) return 'date';
  return typeof a;
}

function sortColumn(type: string, a: any, b: any, desc: boolean) {
  switch (type) {
    case 'number':
      return desc
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a);
    case 'date':
      return desc
        ? new Date(a).getTime() - new Date(b).getTime()
        : new Date(b).getTime() - new Date(a).getTime();
    case 'boolean':
      return desc ? Number(a) - Number(b) : Number(b) - Number(a);
    case 'string':
      return desc
        ? a
            ?.trim()
            .toLowerCase()
            ?.localeCompare?.(b?.trim().toLowerCase())
        : b
            .trim()
            ?.toString()
            ?.toLowerCase()
            ?.localeCompare?.(a?.trim()?.toLowerCase());
    default:
      return -1;
  }
}

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesV6 = () => {
  const context = useContext(ManagerReactComponentContext);
  return context.iceberg.fetchIcebergV6;
};
// export const getResourcesV6 = async ({ route }: IcebergFetchParamsV6) => {
//   const { data, status, totalCount } = (await fetchIcebergV6({ route })) as any;
//   return { data, status, totalCount };
// };

export function useResourcesV6<T = unknown>({
  route,
  queryKey,
  pageSize = 10,
  columns = [],
}: IcebergFetchParamsV6 & ResourcesV6Hook) {
  const context = useContext(ManagerReactComponentContext);
  const { iceberg } = context;
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey],
    queryFn: () => iceberg.fetchIcebergV6<T>({ route }),
    retry: false,
  });
  const [sorting, setSorting] = useState<ColumnSort>();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sortData, setSortData] = useState<T[]>([]);
  const [flattenData, setFlattenData] = useState<T[]>([]);

  useEffect(() => {
    if (data?.data && data?.data?.length > 0) {
      setTotalCount(data.data.length);
      setSortData(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (sortData) {
      const currentPosition = pageIndex * pageSize;
      const slice = sortData?.slice(
        currentPosition,
        currentPosition + pageSize,
      );
      setFlattenData([...flattenData, ...slice]);
    }
  }, [pageIndex, sortData]);

  useEffect(() => {
    setPageIndex(0);

    if (sortData && sorting) {
      const type = columns?.find((element) => element.id === sorting.id)?.type;
      const sortedDatas = sortData?.sort((a: any, b: any) =>
        sortColumn(type, a?.[sorting.id], b?.[sorting.id], sorting?.desc),
      );
      setFlattenData([]);
      setSortData([...sortedDatas]);
    }
  }, [sorting]);

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
    fetchNextPage: onFetchNextPage,
    error,
    status,
  };
}
