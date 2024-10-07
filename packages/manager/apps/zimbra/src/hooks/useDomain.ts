import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';

import {
  getZimbraPlatformDomainDetail,
  getZimbraPlatformDomainQueryKey,
} from '@/api/domain';

export const useDomain = (domainId: string, noCache?: boolean) => {
  const { platformId } = usePlatform();

  return useQuery({
    queryKey: getZimbraPlatformDomainQueryKey(platformId, domainId),
    queryFn: () => getZimbraPlatformDomainDetail(platformId, domainId),
    enabled: !!platformId && !!domainId,
    gcTime: noCache ? 0 : 5000,
  });
};
