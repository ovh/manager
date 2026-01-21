import { UseQueryOptions, UseQueryResult, useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { IamTagsFilter, IamTagsOperator } from '@/types/iam.type';
import { TenantWithSubscriptions } from '@/types/tenants.type';

import { getTenantSubscriptions } from '@/__mocks__/tenants/tenant.adapter';

import { getTenantSubscriptionsQueryKey } from '@/data/hooks/tenants/useTenantSubscriptions.hook';
import { isPollingStatus, POLLING_INTERVAL } from '@/data/hooks/tenants/useTenants.polling';

import { useTenants } from '@/data/hooks/tenants/useTenants.hook';

export const useTenantsWithSubscriptions = (
  resourceName: string,
  regions: string[],
  options?: {
    iamTags?: IamTagsFilter;
    queryOptions?: Omit<UseQueryOptions<TenantWithSubscriptions[], Error>, 'queryKey' | 'queryFn'>;
  },
): UseQueryResult<TenantWithSubscriptions[], Error> => {
  const { iamTags: additionalIamTags, queryOptions } = options || {};

  const iamTags = useMemo<IamTagsFilter | undefined>(() => {
    const validRegions = regions.filter((region) => region && region.trim() !== '');

    if (
      validRegions.length === 0 &&
      !additionalIamTags) {
      return undefined;
    }

    const iamTagsFilter: IamTagsFilter = {
      ...additionalIamTags,
      ...(validRegions.length > 0 && {
        'ovh:region': validRegions.map((region) => ({ operator: IamTagsOperator.EQ, value: region })),
      }),
    };

    return Object.keys(iamTagsFilter).length > 0 ? iamTagsFilter : undefined;
  }, [
    regions,
    additionalIamTags,
  ]);

  const tenantsQuery = useTenants(resourceName, { iamTags });

  const subscriptionQueries = useQueries({
    queries:
      tenantsQuery.data?.map((tenant) => ({
        queryKey: getTenantSubscriptionsQueryKey(resourceName, tenant.id),
        queryFn: ({ signal }: { signal?: AbortSignal }) =>
          getTenantSubscriptions({ resourceName, tenantId: tenant.id, signal }),
        enabled: !!resourceName && !!tenant.id && !!tenantsQuery.data,
      })) ?? [],
  });

  const data = useMemo<TenantWithSubscriptions[] | undefined>(() => {
    if (!tenantsQuery.data) {
      return undefined;
    }

    return tenantsQuery.data.map((tenant, index) => ({
      ...tenant,
      subscriptions: subscriptionQueries[index]?.data ?? [],
    }));
  }, [
    tenantsQuery.data,
    subscriptionQueries,
    regions,
  ]);

  const isLoading =
    tenantsQuery.isLoading || subscriptionQueries.some((query) => query.isLoading);
  const isError =
    tenantsQuery.isError || subscriptionQueries.some((query) => query.isError);
  const error = tenantsQuery.error || subscriptionQueries.find((query) => query.error)?.error || null;

  const shouldPoll = useMemo(() => {
    if (!data) {
      return false;
    }
    return (
      data.some(({ resourceStatus }) => isPollingStatus(resourceStatus)) ||
      subscriptionQueries.some((query) =>
        query.data?.some(({ resourceStatus }) => isPollingStatus(resourceStatus)),
      )
    );
  }, [data, subscriptionQueries]);

  const refetch = async () => {
    const [tenantsResult] = await Promise.all([
      tenantsQuery.refetch(),
      ...subscriptionQueries.map((query) => query.refetch()),
    ]);
    return tenantsResult;
  };

  return {
    ...tenantsQuery,
    data: data as TenantWithSubscriptions[] | undefined,
    isLoading,
    isError,
    error,
    refetch,
    refetchInterval: shouldPoll ? POLLING_INTERVAL : undefined,
    ...queryOptions,
  } as unknown as UseQueryResult<TenantWithSubscriptions[], Error>;
};
