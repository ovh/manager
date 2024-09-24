import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
  OrganizationType,
} from '@/api/organization';

export const useOrganizationList = (
  options: Omit<UseQueryOptions, 'queryKey' | 'queryFn' | 'select'> = {},
) => {
  const { platformId } = usePlatform();

  return useQuery({
    ...options,
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
    queryFn: () => getZimbraPlatformOrganization(platformId),
    enabled:
      (typeof options.enabled !== 'undefined' ? options.enabled : true) &&
      !!platformId,
  }) as UseQueryResult<OrganizationType[]>;
};
