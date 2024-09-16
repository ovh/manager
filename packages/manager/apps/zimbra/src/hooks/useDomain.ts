import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';

import {
  getZimbraPlatformDomainDetail,
  getZimbraPlatformDomainQueryKey,
} from '@/api/domain';

export const useDomain = (domainId: string, noCache?: boolean) => {
  const { platformId } = usePlatform();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformDomainQueryKey(platformId, domainId),
    queryFn: () => getZimbraPlatformDomainDetail(platformId, domainId),
    enabled: !!platformId && !!domainId,
    gcTime: noCache ? 0 : 5000,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
