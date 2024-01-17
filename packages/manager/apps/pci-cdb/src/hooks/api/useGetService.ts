import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getService } from '@/data/cdb/service';

export function useGetService(
  projectId: string,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQuery({
    queryKey,
    queryFn: () => getService(projectId, serviceId),
    ...options,
  }) as UseQueryResult<database.Service, Error>;
}
