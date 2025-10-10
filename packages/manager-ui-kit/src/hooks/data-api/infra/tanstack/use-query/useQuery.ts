import { useQuery as tanstackUseQuery, QueryKey } from '@tanstack/react-query';
import { UseQueryOptions, UseQueryResult } from './useQuery.types';

export const useQuery = <
  TData = Record<string, string>,
  TQueryKey extends QueryKey = QueryKey,
  TError = Error,
>({
  cacheKey,
  fetchDataFn,
  refetchInterval,
  enabled,
}: UseQueryOptions<TQueryKey, TData>): UseQueryResult<TData, TError> => {
  const {
    data = {} as TData,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  } = tanstackUseQuery<TData, TError, TData, TQueryKey>({
    queryKey: cacheKey,
    queryFn: () => fetchDataFn(),
    refetchInterval,
    enabled,
    retry: false,
  });

  return {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    status,
  };
};
