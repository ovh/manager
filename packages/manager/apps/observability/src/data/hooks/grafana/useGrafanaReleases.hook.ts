import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getGrafanaReleases } from '@/__mocks__/grafana/grafana.adapter';
import { GrafanaReleasesResponse } from '@/types/managedDashboards.type';

export const getGrafanaReleasesQueryKey = (resourceName: string, infrastructureId: string) => [
  'grafana-releases',
  resourceName,
  infrastructureId,
];

export const useGrafanaReleases = (
  resourceName: string,
  infrastructureId: string,
  queryOptions?: Omit<UseQueryOptions<GrafanaReleasesResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: getGrafanaReleasesQueryKey(resourceName, infrastructureId),
    queryFn: ({ signal }) => getGrafanaReleases({ resourceName, infrastructureId, signal }),
    enabled: !!resourceName && !!infrastructureId,
    ...queryOptions,
  });
};
