import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getTenantSubscriptions } from '@/__mocks__/tenants/tenant.adapter';
import { POLLING_INTERVAL, isPollingStatus } from '@/data/hooks/polling';
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
    refetchInterval: (query) =>
      query.state.data?.some(({ resourceStatus }) => isPollingStatus(resourceStatus))
        ? POLLING_INTERVAL
        : false,
    ...queryOptions,
  });
};
