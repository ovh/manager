import { UseQueryOptions } from '@tanstack/react-query';

export type TForceReloadUseQueryParams<A, B> = Pick<
  UseQueryOptions<A, Error, B>,
  'refetchOnMount' | 'refetchOnWindowFocus' | 'refetchOnReconnect'
>;

export const getForceReloadUseQueryOptions = <A, B>(): TForceReloadUseQueryParams<A, B> => ({
  refetchOnMount: 'always',
  refetchOnWindowFocus: 'always',
  refetchOnReconnect: 'always',
});
