import * as database from '@/types/cloud/project/database';
import { getMaintenances } from '@/data/api/database/maintenance.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetMaintenances(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getMaintenances>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'maintenance'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMaintenances({ projectId, engine, serviceId }),
    ...options,
  });
}
