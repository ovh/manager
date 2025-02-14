import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import {
  PrometheusData,
  getPrometheus,
} from '@/data/api/database/prometheus.api';

export function useGetPrometheusData(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'prometheus'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPrometheus({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<PrometheusData, Error>;
}
