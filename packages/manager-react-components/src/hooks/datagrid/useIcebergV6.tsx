import { useEffect, useState } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';
import { defaultPageSize } from './index';

interface IcebergV6Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
  shouldFetchAll?: boolean;
}

export const API_V6_MAX_PAGE_SIZE = 4999;

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV6 = fetchIcebergV6;

export function useResourcesIcebergV6<T = unknown>({
  route,
  pageSize = defaultPageSize,
  queryKey,
  defaultSorting = undefined,
  shouldFetchAll = false,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);

  const {
    data: dataSelected,
    hasNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [...queryKey, shouldFetchAll ? 'all' : pageSize, sorting],
    staleTime: Infinity,
    retry: false,
    queryFn: ({ pageParam: pageIndex }) =>
      fetchIcebergV6<T>({
        route,
        pageSize: shouldFetchAll ? API_V6_MAX_PAGE_SIZE : pageSize,
        page: pageIndex,
        sortBy: sorting?.id || null,
        sortReverse: sorting?.desc,
      }),
    getNextPageParam: (lastPage, _allPages, lastPageIndex) => {
      if (lastPage.totalCount / pageSize > lastPageIndex) {
        return lastPageIndex + 1;
      }
      return null;
    },
    select: (data) => {
      const pageIndex = data.pageParams[data.pageParams.length - 1];
      const { totalCount } = data.pages[0];

      return {
        data,
        pageIndex,
        totalCount,
        flattenData: data.pages.flatMap((page) => page.data),
      };
    },
  });

  useEffect(() => {
    if (shouldFetchAll && hasNextPage) {
      fetchNextPage();
    }
  }, [dataSelected]);

  return {
    ...(dataSelected ?? { ...dataSelected, totalCount: 0 }),
    hasNextPage,
    fetchNextPage,
    ...rest,
    sorting,
    setSorting,
  };
}
