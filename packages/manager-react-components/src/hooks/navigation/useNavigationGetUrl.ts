import { useContext } from 'react';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
// eslint-disable-next-line prettier/prettier
import type { ParamValueType } from '@ovh-ux/url-builder';

export const useNavigationGetUrl = (
  linkParams: [string, string, Record<string, ParamValueType>],
  options: Partial<DefinedInitialDataOptions<unknown>> = {},
) => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  return useQuery({
    queryKey: ['shell', 'getUrl', linkParams],
    queryFn: () => navigation.getURL(...linkParams),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
