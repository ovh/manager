import {
  UseInfiniteQueryOptions as TanstackUseInfiniteQueryOptions,
  DefinedUseInfiniteQueryResult as TanstackDefinedUseInfiniteQueryResult,
  InfiniteData as TanstackInfiniteData,
  QueryKey,
  Enabled,
} from '@tanstack/react-query';

export type UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = InfiniteData<TQueryFnData>,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = TanstackUseInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey,
  TPageParam
> & {};

export type DefinedUseInfiniteQueryResult<
  TData = unknown,
  TError = unknown,
> = TanstackDefinedUseInfiniteQueryResult<TData, TError>;

export type InfiniteData<
  TData = unknown,
  TPageParam = unknown,
> = TanstackInfiniteData<TData, TPageParam>;
