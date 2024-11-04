import { useState } from 'react';
import { IcebergFetchParamsV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ColumnSort } from '../../components';

interface IcebergV6Hook {
  queryKey: string[];
  defaultSorting?: ColumnSort;
}

/**
 * @deprecated use fetchIcebergV6 from @ovh-ux/manager-core-api
 */
export const getResourcesIcebergV6 = fetchIcebergV6;

export function useResourcesIcebergV6<T = unknown>({
  route,
  pageSize = 10,
  queryKey,
  defaultSorting = undefined,
}: IcebergFetchParamsV6 & IcebergV6Hook) {
  const [sorting, setSorting] = useState<ColumnSort>(defaultSorting);

  const { data: dataSelected, ...rest } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [...queryKey, pageSize, sorting],
    staleTime: Infinity,
    retry: false,
    queryFn: ({ pageParam: pageIndex }) =>
      fetchIcebergV6<T>({
        route,
        pageSize,
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

  return {
    ...(dataSelected ?? { ...dataSelected, totalCount: 0 }),
    ...rest,
    sorting,
    setSorting,
  };
}
