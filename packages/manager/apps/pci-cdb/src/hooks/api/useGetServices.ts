import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServices } from '@/data/cdb/service';

export function useGetServices(
  projectId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/service'];
  return useQuery({
    queryKey,
    queryFn: () => getServices(projectId),
    ...options,
  }) as UseQueryResult<database.Service[], Error>;
}
