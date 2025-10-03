import { useQuery } from '@tanstack/react-query';

import { getManagedCmsResourceWebsiteTasks } from '@/data/api/managedWordpress';

export const useManagedWordpressResourceTasks = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'resource', serviceName, 'task'],
    queryFn: () => getManagedCmsResourceWebsiteTasks(serviceName),
  });
};
