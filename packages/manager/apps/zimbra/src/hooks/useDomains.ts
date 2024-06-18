import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import { useOrganization } from './useOrganization';

import {
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api';

export const useDomains = (organizationId?: string, noCache?: boolean) => {
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const selectedOrganizationId = organization?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformDomainsQueryKey(
      platformId,
      organizationId || selectedOrganizationId,
    ),
    queryFn: () =>
      getZimbraPlatformDomains(
        platformId,
        organizationId || selectedOrganizationId,
      ),
    enabled: !!platformId,
    gcTime: noCache ? 0 : 5000,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
