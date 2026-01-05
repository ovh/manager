import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenantSubscriptions } from '@/__mocks__/tenants/tenant.adapter';
import { getTenantQueryKey } from '@/data/hooks/tenants/useTenants.hook';
import { TenantSubscription } from '@/types/tenants.type';

export const getTenantSubscriptionsQueryKey = (resourceName: string, tenantId: string) => [
  ...getTenantQueryKey(resourceName, tenantId),
  'subscriptions',
];

export const useTenantSubscriptions = (
  resourceName: string,
  tenantId: string,
  queryOptions?: Omit<UseQueryOptions<TenantSubscription[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getTenantSubscriptionsQueryKey(resourceName, tenantId),
    queryFn: ({ signal }) => getTenantSubscriptions({ resourceName, tenantId, signal }),
    enabled: !!resourceName && !!tenantId,
    ...queryOptions,
  });
};
