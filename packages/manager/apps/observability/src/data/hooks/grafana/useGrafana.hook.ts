import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getGrafanas } from '@/__mocks__/grafana/grafana.adapter';
import { POLLING_INTERVAL, isPollingStatus } from '@/data/hooks/polling';
import { Grafana } from '@/types/managedDashboards.type';

export const getGrafanasQueryKey = (resourceName: string) => ['grafanas', resourceName];

export const useGrafanas = (
  resourceName: string,
  queryOptions?: Omit<UseQueryOptions<Grafana[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getGrafanasQueryKey(resourceName),
    queryFn: ({ signal }) => getGrafanas({ resourceName, signal }),
    enabled: !!resourceName,
    refetchInterval: (query) =>
      query.state.data?.some(({ resourceStatus }) => isPollingStatus(resourceStatus))
        ? POLLING_INTERVAL
        : false,
    ...queryOptions,
  });
};
