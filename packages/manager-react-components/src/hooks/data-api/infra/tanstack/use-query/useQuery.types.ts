import { QueryKey } from '@tanstack/react-query';
import { CommonResult } from '../common.types';

export type UseQueryOptions<
  TQueryKey extends QueryKey = QueryKey,
  TData = Record<string, string>,
> = {
  cacheKey: TQueryKey;
  fetchDataFn: () => Promise<TData>;
  refetchInterval?: number | false;
  enabled?: boolean;
};

export type UseQueryResult<
  TData = Record<string, unknown>,
  TError = Error,
> = CommonResult<TData, TError>;
