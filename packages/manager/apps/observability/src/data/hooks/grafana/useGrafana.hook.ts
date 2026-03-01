import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getGrafana, getGrafanas } from '@/__mocks__/grafana/grafana.adapter';
import { POLLING_INTERVAL, getPollingInterval, isPollingStatus } from '@/data/hooks/polling';
import { Grafana } from '@/types/managedDashboards.type';

export const getGrafanasQueryKey = (resourceName: string) => ['grafanas', resourceName];
export const getGrafanaQueryKey = (resourceName: string, grafanaId: string) => [
  ...getGrafanasQueryKey(resourceName),
  'grafanaId',
  grafanaId,
];

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

export const useGrafana = (
  resourceName: string,
  grafanaId: string,
  queryOptions?: Omit<UseQueryOptions<Grafana | undefined, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getGrafanaQueryKey(resourceName, grafanaId),
    queryFn: ({ signal }) => getGrafana({ resourceName, grafanaId, signal }),
    enabled: !!resourceName && !!grafanaId,
    refetchInterval: (query) => getPollingInterval(query.state.data?.resourceStatus),
    ...queryOptions,
  });
};
