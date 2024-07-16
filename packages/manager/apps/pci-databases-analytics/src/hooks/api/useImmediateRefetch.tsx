import { useEffect, useRef } from 'react';
import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  QueryKey,
  QueryFunction,
} from '@tanstack/react-query';

type QueryOptions<TData, TError> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey'
>;

interface UseQueryImmediateRefetchParams<TData, TError> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData, QueryKey>;
  options?: QueryOptions<TData, TError>;
}

export function useQueryImmediateRefetch<TData, TError>({
  queryKey,
  queryFn,
  options,
}: UseQueryImmediateRefetchParams<TData, TError>): UseQueryResult<
  TData,
  TError
> {
  const prevRefetchInterval = useRef(options?.refetchInterval);

  const query = useQuery({
    queryKey,
    queryFn,
    ...options,
  });
  useEffect(() => {
    if (
      options?.enabled !== false &&
      options.refetchInterval &&
      options.refetchInterval !== prevRefetchInterval.current
    ) {
      query.refetch();
    }
    prevRefetchInterval.current = options.refetchInterval;
  }, [options?.refetchInterval, queryKey, options?.enabled]);

  return query;
}
