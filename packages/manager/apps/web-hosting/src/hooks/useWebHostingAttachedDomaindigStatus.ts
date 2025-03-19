import { useQuery } from '@tanstack/react-query';
import pLimit from 'p-limit';
import {
  getWebHostingAttachedDomainDigStatusQueryKey,
  getWebHostingAttachedDomainDigStatus,
} from '@/api';
import { WebSiteAttachedDomainDigStatusType } from '@/api/type';

const limit = pLimit(15);
export const useWebHostingAttachedDomaindigStatus = (
  serviceName: string,
  domain: string,
) => {
  return useQuery<WebSiteAttachedDomainDigStatusType>({
    queryKey: getWebHostingAttachedDomainDigStatusQueryKey(serviceName, domain),
    queryFn: () =>
      limit(() => getWebHostingAttachedDomainDigStatus(serviceName, domain)),
    enabled: !!serviceName && !!domain,
  });
};
