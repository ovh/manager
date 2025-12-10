import { UseQueryOptions } from '@tanstack/react-query';

export type TApiHookOptions = {
  forceReload?: boolean;
};

export type TForceReloadUseQueryParams = Pick<
  UseQueryOptions,
  'refetchOnMount' | 'refetchOnWindowFocus' | 'refetchOnReconnect'
>;

export const getForceReloadUseQueryParams = (
  forceReload?: boolean,
): TForceReloadUseQueryParams =>
  forceReload
    ? {
        refetchOnMount: 'always',
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: 'always',
      }
    : {};
