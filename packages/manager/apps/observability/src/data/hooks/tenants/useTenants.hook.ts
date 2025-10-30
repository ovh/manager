import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenant, getTenants } from '@/__mocks__/tenants/tenant.adapter';
import { Tenant } from '@/types/tenants.type';

export const getTenantsQueryKey = (resourceName: string) => ['tenants', resourceName];
export const getTenantQueryKey = (resourceName: string, tenantId: string) => [
  'tenant',
  resourceName,
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
    ...queryOptions,
  });
};
