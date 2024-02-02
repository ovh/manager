import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { GenericUser, getUsers } from '@/data/cdb/users';

export function useGetUsers(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'user'];
  return useQuery({
    queryKey,
    queryFn: () => getUsers(projectId, engine, serviceId),
    ...options,
  }) as UseQueryResult<GenericUser[], Error>;
}
