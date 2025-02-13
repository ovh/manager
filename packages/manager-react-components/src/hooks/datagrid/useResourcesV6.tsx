import React, { useState, useEffect } from 'react';
import isDate from 'lodash.isdate';
import {
  IcebergFetchParamsV6,
  fetchIcebergV6,
  applyFilters,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { useColumnFilters, ColumnSort } from '../../components';

export interface ColumnDatagrid {
  cell: (props: any) => React.JSX.Element;
  id: string;
  label: string;
  type: string;
}

export interface ResourcesV6Hook {
  queryKey: string[];
  columns: ColumnDatagrid[];
}

export function dataType(a: any) {
  if (Number.isInteger(a)) return FilterTypeCategories.Numeric;
  if (isDate(a)) return FilterTypeCategories.Date;
  if (typeof a === 'string') return FilterTypeCategories.String;
  if (typeof a === 'boolean') return FilterTypeCategories.Boolean;
  return typeof a;
}

function sortColumn(type: string, a: any, b: any, desc: boolean) {
  switch (type) {
    case FilterTypeCategories.Numeric:
      return desc
        ? parseFloat(a) - parseFloat(b)
        : parseFloat(b) - parseFloat(a);
    case FilterTypeCategories.Date:
      return desc
        ? new Date(a).getTime() - new Date(b).getTime()
        : new Date(b).getTime() - new Date(a).getTime();
    case FilterTypeCategories.Boolean:
      return desc ? Number(a) - Number(b) : Number(b) - Number(a);
    case FilterTypeCategories.String:
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
export const getResourcesV6 = fetchIcebergV6;

export function useResourcesV6<T = unknown>({
  route,
  queryKey,
  pageSize = 10,
  columns = [],
}: IcebergFetchParamsV6 & ResourcesV6Hook) {
  const { data, isError, isLoading, error, status } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchIcebergV6<T>({ route }),
    retry: false,
  });
  const [sorting, setSorting] = useState<ColumnSort>();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [sortData, setSortData] = useState<T[]>([]);
  const [flattenData, setFlattenData] = useState<T[]>([]);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  useEffect(() => {
    if (data?.data && data?.data?.length > 0) {
      setTotalCount(data.data.length);
      setSortData(data.data);
    }
  }, [data, filters]);

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
      setSortData(applyFilters([...sortedDatas], filters));
    }
  }, [sorting]);

  useEffect(() => {
    if (sortData.length > 0) {
      setPageIndex(0);
      const dataFiltered = applyFilters(data?.data, filters);
      setFlattenData([]);
      setSortData([...dataFiltered]);
    }
  }, [filters]);

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
    hasNextPage: pageIndex * pageSize + pageSize <= flattenData.length,
    fetchNextPage: onFetchNextPage,
    error,
    status,
    filters: {
      filters,
      add: addFilter,
      remove: removeFilter,
    },
  };
}
