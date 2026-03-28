import { useEffect, useRef } from 'react';
import {
  useQuery,
  UseQueryOptions,
  QueryKey,
  DefaultError,
} from '@tanstack/react-query';

export type DataFrom<F> = F extends (...a: unknown[]) => Promise<infer R>
  ? R
  : never;

export type OptionsFor<
  F extends (...a: unknown[]) => Promise<unknown>,
  TError = DefaultError,
  TKey extends QueryKey = QueryKey
> = Omit<
  UseQueryOptions<DataFrom<F>, TError, DataFrom<F>, TKey>,
  'queryKey' | 'queryFn'
>;

export function useQueryImmediateRefetch<T>({
  queryKey,
  queryFn,
  ...options
}: {
  queryKey: string[];
  queryFn: () => Promise<T>;
} & Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryKey' | 'queryFn'>) {
  const prevRefetchInterval = useRef(options?.refetchInterval);
  const query = useQuery({
    queryKey,
    queryFn,
    ...options,
  });
  useEffect(() => {
    if (
      options?.enabled !== false &&
      options?.refetchInterval !== undefined &&
      options?.refetchInterval !== prevRefetchInterval.current
    ) {
      query.refetch();
    }
    prevRefetchInterval.current = options?.refetchInterval;
  }, [options?.refetchInterval, queryKey, options?.enabled, query]);
  return query;
}
