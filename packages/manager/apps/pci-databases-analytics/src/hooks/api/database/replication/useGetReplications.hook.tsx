import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getReplications } from '@/data/api/database/replication.api';

export function useGetReplications(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'replication'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getReplications({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Replication[], Error>;
}
