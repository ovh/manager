import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getConnectorConfiguration } from '@/data/api/database/connector.api';

export function useGetConnectorConfiguration(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  connectorCapabilityId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities',
    'connector',
    connectorCapabilityId,
    'configuration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getConnectorConfiguration({
        projectId,
        engine,
        serviceId,
        connectorCapabilityId,
      }),
    ...options,
  }) as UseQueryResult<
    database.kafkaConnect.capabilities.connector.configuration.Property[],
    Error
  >;
}
