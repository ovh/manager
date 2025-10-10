import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getPrometheus } from '@/data/api/database/prometheus.api';

export function useGetPrometheusData(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getPrometheus>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'prometheus'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPrometheus({ projectId, engine, serviceId }),
    ...options,
  });
}
