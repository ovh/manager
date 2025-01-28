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
  const prevQueryKey = useRef<QueryKey>(options.queryKey);
  const query = useQuery(options, queryClient);

  useEffect(() => {
    const queryKeyChanged =
      JSON.stringify(prevQueryKey.current) !== JSON.stringify(options.queryKey);

    if (options?.enabled !== false && queryKeyChanged) {
      query.refetch();
    }

    prevQueryKey.current = options.queryKey;
  }, [options.queryKey, options.enabled, query]);

  return query;
}
