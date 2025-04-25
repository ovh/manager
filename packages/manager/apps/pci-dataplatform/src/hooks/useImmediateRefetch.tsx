import { useEffect, useRef } from 'react';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  QueryKey,
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
  QueryClient,
  DefinedUseQueryResult,
  DefaultError,
} from '@tanstack/react-query';

type UseQueryWrapperOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey
> =
  | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;

export function useQueryImmediateRefetch<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryWrapperOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError> {
  const prevRefetchInterval = useRef(options?.refetchInterval);

  const query = useQuery(options, queryClient);

  useEffect(() => {
    if (
      options?.enabled !== false &&
      options.refetchInterval !== undefined &&
      options.refetchInterval !== prevRefetchInterval.current
    ) {
      query.refetch();
    }
    prevRefetchInterval.current = options.refetchInterval;
  }, [options.refetchInterval, options.queryKey, options.enabled, query]);

  return query;
}
