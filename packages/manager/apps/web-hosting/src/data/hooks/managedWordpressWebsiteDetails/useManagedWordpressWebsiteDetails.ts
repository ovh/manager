import { useQuery } from '@tanstack/react-query';
import { getManagedCmsResourceWebsiteDetails } from '@/data/api/managedWordpress';

export const useManagedWordpressWebsiteDetails = (
  serviceName: string,
  websiteId: string,
) => {
  return useQuery({
    queryKey: [
      'get',
      'managedCMS',
      'resource',
      serviceName,
      'website',
      websiteId,
    ],
    queryFn: () => getManagedCmsResourceWebsiteDetails(serviceName, websiteId),
  });
};
