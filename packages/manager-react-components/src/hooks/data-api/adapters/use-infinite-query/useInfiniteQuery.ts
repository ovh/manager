import {
  useInfiniteQuery as tanstackUseInfiniteQuery,
  QueryKey,
} from '@tanstack/react-query';
import {
  UseInfiniteQueryOptions,
  DefinedUseInfiniteQueryResult,
} from './useInfiniteQuery.types';

export const useInfiniteQuery = <
  TQueryFnData = Record<string, unknown>,
  TError = Error,
  TSelectData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number|string,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TSelectData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
): DefinedUseInfiniteQueryResult<TSelectData, TError> => {
  return tanstackUseInfiniteQuery<
    TQueryFnData,
    TError,
    TSelectData,
    TQueryKey,
    TPageParam
  >(options) as DefinedUseInfiniteQueryResult<TSelectData, TError>;
};
