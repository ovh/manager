import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getServiceCapabilitiesIntegrations } from '@/data/api/database/integration.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetCapabilitiesIntegrations(
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
    'capabilities/integration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getServiceCapabilitiesIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.capabilities.Integration[], Error>;
}
