import {
  UseQueryResult as TanstackUseQueryResult,
  UseQueryOptions as TanstackUseQueryOptions,
  Query,
  Enabled,
  QueryKey,
} from '@tanstack/react-query';

export type UseQueryOptions = TanstackUseQueryOptions;

export type UseQueryResult<
  TData = Record<string, unknown>,
  TError = Error,
> = TanstackUseQueryResult<TData, TError>;

export type TRefetchInterval =
  | number
  | false
  | ((query: Query) => number | false | undefined);
