import { useQuery } from '@tanstack/react-query';
import { getManagedCmsResourceWebsiteDetails } from '@/data/api/managedWordpress';

export const useManagedWordpressWebsiteDetails = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'service', serviceName, 'website'],
    queryFn: () => getManagedCmsResourceWebsiteDetails(serviceName),
  });
};
