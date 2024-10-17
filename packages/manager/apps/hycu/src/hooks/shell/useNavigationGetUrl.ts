import { ParamValueType } from '@ovh-ux/url-builder';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const useNavigationGetUrl = (
  linkParams: [string, string, Record<string, ParamValueType>],
  options?: Partial<DefinedInitialDataOptions<unknown>>,
) => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  return useQuery({
    queryKey: ['shell', 'getUrl', linkParams],
    queryFn: () => navigation.getURL(...linkParams),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
  });
};
