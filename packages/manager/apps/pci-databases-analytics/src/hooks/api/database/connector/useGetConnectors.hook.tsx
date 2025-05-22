import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getConnectors } from '@/data/api/database/connector.api';

export function useGetConnectors(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'connector'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnectors({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.kafkaConnect.Connector[], Error>;
}
