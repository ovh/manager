import * as database from '@/types/cloud/project/database';
import { getMetrics } from '@/data/api/database/metric.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetMetrics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getMetrics>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'metric'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMetrics({ projectId, engine, serviceId }),
    ...options,
  });
}
