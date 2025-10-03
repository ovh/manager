import { useEffect } from 'react';
import { fetchV2, FetchV2Result } from '@ovh-ux/manager-core-api';
import { UseDataApiResult } from '../../ports/use-data-api/useDataApi.types';
import {
  useInfiniteQuery,
  UseInifiniteQueryResult,
} from '../../infra/tanstack/use-infinite-query';
import type { UseV2Params, UseV2Data } from './useV2.types';

export const useV2 = <TData = Record<string, unknown>>({
  route = '',
  pageSize = 10,
  fetchAll = false,
  cacheKey,
  enabled,
}: UseV2Params): UseDataApiResult<TData> => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    ...rest
  }: UseInifiniteQueryResult<UseV2Data<TData>> = useInfiniteQuery<
    FetchV2Result<TData>,
    Error,
    UseV2Data<TData>,
    string[],
    string
  >({
    initialPageParam: '',
    cacheKey: [...cacheKey, fetchAll ? 'all' : String(pageSize)],
    enabled: enabled ?? true,
    fetchDataFn: ({ pageParam: cursor }): Promise<FetchV2Result<TData>> =>
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
    transformFn: (pages): UseV2Data<TData> => {
      const { totalCount } = pages[0] as FetchV2Result;
      return {
        flattenData: pages.flatMap((page) => page.data),
        totalCount,
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
