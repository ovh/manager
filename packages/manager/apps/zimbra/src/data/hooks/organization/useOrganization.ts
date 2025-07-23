import { useParams, useSearchParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  OrganizationType,
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/data/api';

type UseOrganizationParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  organizationId?: string;
};

export const useOrganization = (props: UseOrganizationParams = {}) => {
  const { organizationId, ...options } = props;
  const { platformId, organizationId: paramsId } = useParams();
  const [searchParams] = useSearchParams();
  const id = organizationId || paramsId || searchParams.get('organizationId');
  return useQuery({
    queryKey: getZimbraPlatformOrganizationDetailsQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformOrganizationDetails(platformId, id),
    ...options,
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!id &&
      !!platformId,
  }) as UseQueryResult<OrganizationType>;
};
