import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getReplications } from '@/data/api/database/replication.api';

export function useGetReplications(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getReplications>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'replication'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getReplications({ projectId, engine, serviceId }),
    ...options,
  });
}
