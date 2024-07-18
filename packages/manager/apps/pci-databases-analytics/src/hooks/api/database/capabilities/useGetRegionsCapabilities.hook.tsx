import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getRegionsCapabilities } from '@/data/api/database/capabilities.api';

export function useGetRegionsCapabilities(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/capabilities/regions'];
  return useQuery({
    queryKey,
    queryFn: () => getRegionsCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.RegionCapabilities[], Error>;
}
