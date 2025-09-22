import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ResponseAPIError, TQuota } from '@ovh-ux/manager-pci-common';

import { getProjectQuotaByRegion } from '@/api/data/quota';

export const getProjectQuotaQuery = <T = TQuota>(
  projectId: string,
  regionName: string,
): UseQueryOptions<TQuota, ResponseAPIError, T, QueryKey> => ({
  queryKey: ['project', projectId, 'region', regionName, 'quota'],
  queryFn: () => getProjectQuotaByRegion(projectId, regionName),
  enabled: !!projectId && !!regionName,
});

export const useProjectQuotaByRegion = <TData = TQuota>(
  projectId: string,
  regionName: string,
  options?: Omit<UseQueryOptions<TQuota, ResponseAPIError, TData>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TQuota, ResponseAPIError, TData>({
    ...getProjectQuotaQuery(projectId, regionName),
    ...options,
  });
