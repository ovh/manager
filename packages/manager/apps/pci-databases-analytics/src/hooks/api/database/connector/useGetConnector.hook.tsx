import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getConnector } from '@/data/api/database/connector.api';

export function useGetConnector(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'connector',
    connectorId,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnector({ projectId, engine, serviceId, connectorId }),
    ...options,
  }) as UseQueryResult<database.kafkaConnect.Connector, Error>;
}
