import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getGrafanas } from '@/__mocks__/grafana/grafana.adapter';
import { POLLING_INTERVAL } from '@/data/hooks/grafana/useGrafana.polling';
import { Grafana } from '@/types/managedDashboards.type';

export const getGrafanasQueryKey = (resourceName: string) => ['Grafanas', resourceName];

export const useGrafanas = (
  resourceName: string,
  queryOptions?: Omit<UseQueryOptions<Grafana[], Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getGrafanasQueryKey(resourceName),
    queryFn: ({ signal }) => getGrafanas({ resourceName, signal }),
    enabled: !!resourceName,
    refetchInterval: POLLING_INTERVAL,
    ...queryOptions,
  });
};
