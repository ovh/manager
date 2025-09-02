import { useQuery } from '@tanstack/react-query';
import pLimit from 'p-limit';

import {
  getWebHostingAttachedDomainDigStatus,
  getWebHostingAttachedDomainDigStatusQueryKey,
} from '@/data/api/AttachedDomainDigStatus';
import { WebSiteAttachedDomainDigStatusType } from '@/data/types/product/website';

const limit = pLimit(15);
export const useWebHostingAttachedDomaindigStatus = (serviceName: string, domain: string) => {
  return useQuery<WebSiteAttachedDomainDigStatusType>({
    queryKey: getWebHostingAttachedDomainDigStatusQueryKey(serviceName, domain),
    queryFn: () => limit(() => getWebHostingAttachedDomainDigStatus(serviceName, domain)),
    enabled: !!serviceName && !!domain,
  });
};
