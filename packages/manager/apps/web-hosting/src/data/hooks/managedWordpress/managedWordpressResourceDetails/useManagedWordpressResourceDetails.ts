import { useQuery } from '@tanstack/react-query';

import { getManagedCmsResourceDetails } from '@/data/api/managedWordpress';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

export const useManagedWordpressResourceDetails = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'resource', serviceName],
    queryFn: () => getManagedCmsResourceDetails(serviceName),
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
};
