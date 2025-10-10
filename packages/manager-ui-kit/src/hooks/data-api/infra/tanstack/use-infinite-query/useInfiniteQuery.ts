import {
  useInfiniteQuery as tanstackUseInfiniteQuery,
  QueryKey,
  InfiniteData,
} from '@tanstack/react-query';
import {
  UseInfiniteQueryOptions,
  UseInifiniteQueryResult,
} from './useInfiniteQuery.types';

export const useInfiniteQuery = <
  TQueryFnData = Record<string, unknown>,
  TError = Error,
  TSelectData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
>({
  initialPageParam,
  cacheKey,
  enabled,
  fetchDataFn,
  getNextPageParam,
  transformFn,
}: UseInfiniteQueryOptions<
  TQueryKey,
  TQueryFnData,
  TSelectData,
  TPageParam
>): UseInifiniteQueryResult<TSelectData, TError> => {
  const {
    data = {} as TSelectData,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = tanstackUseInfiniteQuery<
    TQueryFnData,
    TError,
    TSelectData,
    TQueryKey,
    TPageParam
  >({
    initialPageParam,
    queryKey: cacheKey,
    staleTime: Infinity,
    retry: false,
    enabled,
    queryFn: (params) => {
      return fetchDataFn({ pageParam: params.pageParam as TPageParam });
    },
    getNextPageParam: (
      currentLastPage: TQueryFnData,
      _allPages,
      currentPageIndex: TPageParam,
    ): TPageParam | null => {
      return getNextPageParam(currentLastPage, currentPageIndex);
    },
    select: (
      queryFnResponse: InfiniteData<TQueryFnData, TPageParam>,
    ): TSelectData => {
      return transformFn(queryFnResponse.pages, queryFnResponse.pageParams);
    },
  });

  return {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};
