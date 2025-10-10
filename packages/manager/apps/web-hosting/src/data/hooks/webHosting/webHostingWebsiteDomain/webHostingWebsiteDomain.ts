import { useQuery } from '@tanstack/react-query';

import {
  getWebHostingWebsiteDomain,
  getWebHostingWebsiteDomainQueryKey,
} from '@/data/api/webHosting';

export const useWebHostingWebsiteDomain = (serviceName: string, id: number) => {
  return useQuery({
    queryKey: getWebHostingWebsiteDomainQueryKey(serviceName, id),
    queryFn: () => getWebHostingWebsiteDomain(serviceName, id),
    enabled: false,
  });
};
