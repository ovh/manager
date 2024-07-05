import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getServiceBackups } from '@/data/api/database/backup.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceBackups({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.Backup[], Error>;
}
