import { useQuery } from '@tanstack/react-query';

import { getManagedCmsResourceWebsiteTasks } from '@/data/api/managedWordpress';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';

export const useManagedWordpressResourceTasks = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'resource', serviceName, 'task'],
    queryFn: () => getManagedCmsResourceWebsiteTasks(serviceName),
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
};
