import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenant, getTenants } from '@/__mocks__/tenants/tenant.adapter';
import { POLLING_INTERVAL, getPollingInterval, isPollingStatus } from '@/data/hooks/polling';
import { Tenant } from '@/types/tenants.type';

export const getTenantsQueryKey = (resourceName: string) => ['tenants', resourceName];
export const getTenantQueryKey = (resourceName: string, tenantId: string) => [
  ...getTenantsQueryKey(resourceName),
  'tenantId',
  tenantId,
];

export const useTenants = (
  resourceName: string,
  queryOptions?: Omit<UseQueryOptions<Tenant[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getTenantsQueryKey(resourceName),
    queryFn: ({ signal }) => getTenants({ resourceName, signal }),
    enabled: !!resourceName,
    refetchInterval: (query) =>
      query.state.data?.some(({ resourceStatus }) => isPollingStatus(resourceStatus))
        ? POLLING_INTERVAL
        : false,
    ...queryOptions,
  });
};

export const useTenant = (
  resourceName: string,
  tenantId: string,
  queryOptions?: Omit<UseQueryOptions<Tenant | undefined, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getTenantQueryKey(resourceName, tenantId),
    queryFn: ({ signal }) => getTenant({ resourceName, tenantId, signal }),
    enabled: !!resourceName && !!tenantId,
    refetchInterval: (query) => getPollingInterval(query.state.data?.resourceStatus),
    ...queryOptions,
  });
};
