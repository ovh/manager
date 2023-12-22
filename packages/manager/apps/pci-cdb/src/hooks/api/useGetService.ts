import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { cdbApi } from '@/data/cdbapi';
import { database } from '@/models/database';

export function useGetService(
  projectId: string,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQuery({
    queryKey,
    queryFn: () => cdbApi.getService(projectId, serviceId),
    ...options,
  }) as UseQueryResult<database.Service, Error>;
}
