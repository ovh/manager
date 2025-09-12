import {
  useInfiniteQuery as tanstackUseInfiniteQuery,
  QueryKey,
} from '@tanstack/react-query';
import {
  UseInfiniteQueryOptions,
  DefinedUseInfiniteQueryResult,
} from './useInfiniteQuery.types';

export const useInfiniteQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TSelectData = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
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
