import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenants } from '@/__mocks__/tenants/tenant.adapter';
import { Tenant } from '@/types/tenants.type';

export const getTenantsQueryKey = (resourceName: string) => ['tenants', resourceName];

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
