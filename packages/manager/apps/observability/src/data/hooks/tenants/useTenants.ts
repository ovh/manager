import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenants } from '@/__mocks__/tenants/tenant.adapter';
import { Tenant } from '@/types/observability.type';

export const getTenantsQueryKey = (serviceName: string) => ['tenants', serviceName];

export const useTenants = (
  serviceName: string,
  queryOptions?: Omit<UseQueryOptions<Tenant[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getTenantsQueryKey(serviceName),
    queryFn: ({ signal }) => getTenants(serviceName, signal),
    enabled: !!serviceName,
    ...queryOptions,
  });
};
