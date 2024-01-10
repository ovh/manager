import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { cdbApi } from '@/data/cdbapi';
import { database } from '@/models/database';

export function useGetCapabilities(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/capabilities'];
  return useQuery({
    queryKey,
    queryFn: () => cdbApi.getCapabilities(projectId),
    ...options,
  }) as UseQueryResult<database.Capabilities, Error>;
}
