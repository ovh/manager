import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getEnginesCapabilities } from '@/data/api/database/capabilities.api';

export function useGetEnginesCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/engines'];
  return useQuery({
    queryKey,
    queryFn: () => getEnginesCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.EngineCapabilities[], Error>;
}
