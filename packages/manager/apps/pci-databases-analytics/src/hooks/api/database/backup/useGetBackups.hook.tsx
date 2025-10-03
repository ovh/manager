import * as database from '@/types/cloud/project/database';
import { getServiceBackups } from '@/data/api/database/backup.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetBackups(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getServiceBackups>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'backup'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceBackups({ projectId, engine, serviceId }),
    ...options,
  });
}
