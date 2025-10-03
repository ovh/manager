import * as database from '@/types/cloud/project/database';
import { getServiceLogs } from '@/data/api/database/logs.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetServiceLogs(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getServiceLogs>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'logs'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceLogs({ projectId, engine, serviceId }),
    ...options,
  });
}
