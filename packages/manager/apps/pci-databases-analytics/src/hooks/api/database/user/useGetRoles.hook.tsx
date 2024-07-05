import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getRoles } from '@/data/api/database/user.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetRoles(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'roles'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRoles({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<string[], Error>;
}
