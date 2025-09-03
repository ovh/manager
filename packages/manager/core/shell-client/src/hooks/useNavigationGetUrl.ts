import { useContext } from 'react';

import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { ParamValueType } from '@ovh-ux/url-builder';

import { ShellContext } from '../ShellContext';

export const useNavigationGetUrl = (
  linkParams: [string, string, Record<string, ParamValueType>],
  options: Partial<DefinedInitialDataOptions<unknown>> = {},
) => {
  const { shell } = useContext(ShellContext);

  return useQuery({
    queryKey: ['shell', 'getUrl', ...linkParams],
    queryFn: () => shell?.navigation.getURL(...linkParams),
    enabled: !!shell, // avoid running if shell is null
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
