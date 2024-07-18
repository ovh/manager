import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getRoles } from '@/data/api/database/user.api';

export function useGetRoles(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'roles'];
  return useQuery({
    queryKey,
    queryFn: () => getRoles({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<string[], Error>;
}
