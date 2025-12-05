import { useQuery } from '@tanstack/react-query';

import { getWebHostingWebsite } from '@/data/api/webHosting';

export const useWebHostingWebsite = (serviceName: string) => {
  return useQuery({
    queryKey: ['get', 'webhosting', 'resource', serviceName, 'website'],
    queryFn: () => getWebHostingWebsite(serviceName),
  });
};
