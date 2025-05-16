import { ResponseAPIError, TQuota } from '@ovh-ux/manager-pci-common';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { getProjectQuotaByRegion } from '@/api/data/quota';

export const getProjectQuotaQuery = (
  projectId: string,
  regionName: string,
) => ({
  queryKey: ['project', projectId, 'region', regionName, 'quota'],
  queryFn: () => getProjectQuotaByRegion(projectId, regionName),
});

export const useProjectQuotaByRegion = (
  projectId: string,
  regionName: string,
  select?: (data: TQuota[]) => unknown,
  options?: QueryOptions<TQuota[], ResponseAPIError>,
) =>
  useQuery({
    ...getProjectQuotaQuery(projectId, regionName),
    select,
    ...options,
  });
