import {
  QueryClient,
  useQuery as tanstackUseQuery,
} from '@tanstack/react-query';
import { UseQueryOptions, UseQueryResult } from './useQuery.types';

export const useQuery = <TData = unknown, TError = unknown>(
  options: UseQueryOptions,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> => {
  return tanstackUseQuery(options, queryClient) as UseQueryResult<
    TData,
    TError
  >;
};
