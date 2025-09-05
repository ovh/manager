import * as database from '@/types/cloud/project/database';
import { getServiceDatabases } from '@/data/api/database/database.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetDatabases(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getServiceDatabases>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'database'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceDatabases({ projectId, engine, serviceId }),
    ...options,
  });
}
