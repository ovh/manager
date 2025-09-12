import { useEffect } from 'react';
import { fetchV2, FetchV2Result } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../useDataApi.types';
import {
  useInfiniteQuery,
  InfiniteData,
  DefinedUseInfiniteQueryResult,
} from '../../adapters/use-infinite-query';
import type { UseV2Params, SelectData } from './useV2.types';

export const useV2 = <TData = unknown>({
  route = '',
  pageSize = 10,
  fetchAll = false,
  queryKey,
  enabled,
}: UseV2Params): UseDataApiResult<TData> => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    ...rest
  }: DefinedUseInfiniteQueryResult<SelectData<TData>> = useInfiniteQuery<
    FetchV2Result<TData>,
    Error,
    SelectData<TData>
  >({
    initialPageParam: 1,
    queryKey: [...queryKey, fetchAll ? 'all' : pageSize],
    staleTime: Infinity,
    enabled: enabled ?? true,
    retry: false,
    queryFn: ({ pageParam: cursor }) =>
      fetchV2<TData>({
        route,
        pageSize,
        ...(!!cursor && typeof cursor === 'string' && { cursor }),
      }),
    getNextPageParam: (lastPage: FetchV2Result<TData>): string | null => {
      if (lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      return null;
    },
    select: (data: InfiniteData<FetchV2Result<TData>>): SelectData<TData> => {
      const { totalCount } = data.pages[0] as FetchV2Result<TData>;
      return {
        data,
        totalCount,
        flattenData: data.pages.flatMap((page) => page.data),
      };
    },
  });

  useEffect(() => {
    if (fetchAll && hasNextPage) {
      fetchNextPage();
    }
  }, [data]);

  return {
    ...(data && { ...data }),
    hasNextPage,
    fetchNextPage,
    ...rest,
  };
};
