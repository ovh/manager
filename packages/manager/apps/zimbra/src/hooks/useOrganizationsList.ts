import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/api/organization';

export const useOrganizationList = (options = {}) => {
  const { platformId } = usePlatform();

  return useQuery({
    ...options,
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
    queryFn: () => getZimbraPlatformOrganization(platformId),
    enabled: !!platformId,
  });
};
