import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { cdbApi } from '@/data/cdbapi';
import { database } from '@/models/database';

export function useGetServices(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/service'];
  return useQuery({
    queryKey,
    queryFn: () => cdbApi.getServices(projectId),
    ...options,
  }) as UseQueryResult<database.Service[], Error>;
}
