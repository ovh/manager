import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import { useOrganization } from './useOrganization';

import {
  getZimbraPlatformDomains,
  getZimbraPlatformDomainsQueryKey,
} from '@/api';

export const useDomains = () => {
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();

  const organizationId = organization?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformDomainsQueryKey(platformId, organizationId),
    queryFn: () => getZimbraPlatformDomains(platformId, organizationId),
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
