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
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
  }) as UseQueryResult<OrganizationType[]>;
};
