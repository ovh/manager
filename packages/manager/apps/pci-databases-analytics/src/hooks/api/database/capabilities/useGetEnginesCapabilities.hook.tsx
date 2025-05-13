import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getEnginesCapabilities } from '@/data/api/database/capabilities.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetEnginesCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/engines'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getEnginesCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.capabilities.EngineCapabilities[], Error>;
}
