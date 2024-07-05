import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getRegionsCapabilities } from '@/data/api/database/capabilities.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetRegionsCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/regions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegionsCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.capabilities.RegionCapabilities[], Error>;
}
