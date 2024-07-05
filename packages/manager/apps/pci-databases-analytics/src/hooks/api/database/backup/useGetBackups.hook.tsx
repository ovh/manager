import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getServiceBackups } from '@/data/api/database/backup.api';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceBackups({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.Backup[], Error>;
}
