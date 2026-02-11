import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenants } from '@/data/api/tenants.api';
import { IamTagsFilter } from '@/types/iam.type';

import {
  POLLING_INTERVAL,
  isPollingStatus,
} from '@/data/hooks/tenants/useTenants.polling';

import { Tenant, TenantWithSubscriptions } from '@/types/tenants.type';

export const getTenantsQueryKey = (resourceName: string, iamTags?: IamTagsFilter) => [
  'tenants',
  resourceName,
  ...(iamTags ? ['iamTags', JSON.stringify(iamTags)] : []),
];
export const getTenantQueryKey = (resourceName: string, tenantId: string) => [
  ...getTenantsQueryKey(resourceName),
  'tenantId',
  tenantId,
];

export const useTenants = (
  resourceName: string,
  options?: {
    iamTags?: IamTagsFilter;
    queryOptions?: Omit<UseQueryOptions<Tenant[], Error>, 'queryKey' | 'queryFn'>;
  },
) => {
  const { iamTags, queryOptions } = options || {};

  return useQuery({
    queryKey: getTenantsQueryKey(resourceName, iamTags),
    queryFn: ({ signal }) => getTenants({ resourceName, signal, iamTags }),
    enabled: !!resourceName,
    refetchInterval: (query) =>
      query.state.data?.some(({ resourceStatus }) => isPollingStatus(resourceStatus))
        ? POLLING_INTERVAL
        : false,
    ...queryOptions,
  });
};
