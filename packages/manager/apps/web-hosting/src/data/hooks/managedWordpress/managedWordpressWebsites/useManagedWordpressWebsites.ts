import { useQuery } from '@tanstack/react-query';

import { getManagedCmsResourceWebsites } from '@/data/api/managedWordpress';

export const useManagedWordpressWebsites = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'service', serviceName, 'website'],
    queryFn: () => getManagedCmsResourceWebsites(serviceName),
  });
};
