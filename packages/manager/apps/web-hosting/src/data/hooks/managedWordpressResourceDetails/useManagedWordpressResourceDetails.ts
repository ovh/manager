import { useQuery } from '@tanstack/react-query';
import { getManagedCmsResourceDetails } from '@/data/api/managedWordpress';

export const useManagedWordpressResourceDetails = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'resource', serviceName],
    queryFn: () => getManagedCmsResourceDetails(serviceName),
  });
};
