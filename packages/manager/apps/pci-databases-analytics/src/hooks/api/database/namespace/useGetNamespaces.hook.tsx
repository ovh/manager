import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getNamespaces } from '@/data/api/database/namespace.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetNamespaces(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'namespace'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getNamespaces({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.m3db.Namespace[], Error>;
}
