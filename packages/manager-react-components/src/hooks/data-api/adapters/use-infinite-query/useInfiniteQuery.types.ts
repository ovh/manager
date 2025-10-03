import { InfiniteQueryObserverResult } from '@tanstack/react-query';
import { CommonResult } from '../common.types';

export type UseInfiniteQueryOptions<
  TQueryKey,
  TQueryFnData,
  TSelectData,
  TPageParam,
> = {
  initialPageParam: TPageParam;
  cacheKey: TQueryKey;
  enabled?: boolean;
  fetchDataFn: ({
    pageParam,
  }: {
    pageParam: TPageParam;
  }) => Promise<TQueryFnData>;
  getNextPageParam: (
    data: TQueryFnData,
    pageIndex: TPageParam,
  ) => TPageParam | null;
  transformFn: (data: TQueryFnData[], pageParams: TPageParam[]) => TSelectData;
};

export type UseInifiniteQueryResult<
  TData = Record<string, unknown>,
  TError = Error,
> = CommonResult<TData, TError> & {
  fetchNextPage: () => Promise<InfiniteQueryObserverResult<TData, TError>>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};
