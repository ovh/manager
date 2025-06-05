import { useContext } from 'react';
import { queryOptions } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useLocationsQueryOptions = () => {
  const {
    shell: { location },
  } = useContext(ShellContext);
  return queryOptions({
    queryKey: ['shell', 'getLocations'],
    queryFn: () => Promise.resolve(location.getLocations()),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 5000,
  });
};
