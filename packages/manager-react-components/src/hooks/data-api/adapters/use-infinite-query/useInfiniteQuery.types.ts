import {
  UseInfiniteQueryOptions as TanstackUseInfiniteQueryOptions,
  DefinedUseInfiniteQueryResult as TanstackDefinedUseInfiniteQueryResult,
  InfiniteData as TanstackInfiniteData,
  QueryKey,
  Enabled,
} from '@tanstack/react-query';

export type UseInfiniteQueryOptions<
  TQueryFnData = Record<string, unknown>,
  TError = Error,
  TData = InfiniteData<TQueryFnData>,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = string,
> = TanstackUseInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey,
  TPageParam
>;

export type DefinedUseInfiniteQueryResult<
  TData = Record<string, unknown>,
  TError = Error,
> = TanstackDefinedUseInfiniteQueryResult<TData, TError>;

export type InfiniteData<
  TData = Record<string, unknown>,
  TPageParam = string|number,
> = TanstackInfiniteData<TData, TPageParam>;
