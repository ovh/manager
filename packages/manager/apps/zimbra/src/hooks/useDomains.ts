import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform, useOrganization } from '@/hooks';

import {
  DomainType,
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';

type UseDomainsParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'select' | 'enabled' | 'gcTime'
> & {
  organizationId?: string;
  noCache?: boolean;
};

export const useDomains = (props: UseDomainsParams = {}) => {
  const { organizationId, noCache, ...options } = props;
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const selectedOrganizationId = organization?.id;

  return useQuery({
    ...options,
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
  }) as UseQueryResult<DomainType[]>;
};
