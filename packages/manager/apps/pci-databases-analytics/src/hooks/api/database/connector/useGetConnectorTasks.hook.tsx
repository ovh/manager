import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getConnectorTasks } from '@/data/api/database/connector.api';

export function useGetConnectorTasks(
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
    'task',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getConnectorTasks({ projectId, engine, serviceId, connectorId }),
    ...options,
  }) as UseQueryResult<database.kafkaConnect.connector.Task[], Error>;
}
