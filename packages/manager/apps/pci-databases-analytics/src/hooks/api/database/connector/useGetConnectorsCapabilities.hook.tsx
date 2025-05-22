import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getConnectorsCapabilities } from '@/data/api/database/connector.api';

export function useGetConnectorsCapabilities(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities',
    'connector',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnectorsCapabilities({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.kafkaConnect.capabilities.Connector[], Error>;
}
