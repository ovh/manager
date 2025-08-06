import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getUserAccess } from '@/data/api/database/user.api';

export function useGetUserAccess(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  userId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'user',
    userId,
    'access',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUserAccess({ projectId, engine, serviceId, userId }),
    ...options,
  }) as UseQueryResult<database.kafka.user.Access, Error>;
}
