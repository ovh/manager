import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServiceBackups } from '@/data/cdb/backups';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceBackups(projectId, engine, serviceId),
    ...options,
  }) as UseQueryResult<database.Backup[], Error>;
}
