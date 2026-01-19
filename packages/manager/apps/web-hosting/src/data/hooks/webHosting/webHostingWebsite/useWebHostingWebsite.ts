import { useQuery } from '@tanstack/react-query';

import { getWebHostingWebsite } from '@/data/api/webHosting';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

export const useWebHostingWebsite = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'webhosting', 'resource', serviceName, 'website'],
    queryFn: () => getWebHostingWebsite(serviceName),
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
};
