import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getServiceCapabilitiesIntegrations } from '@/data/api/database/integration.api';

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
  return useQuery({
    queryKey,
    queryFn: () =>
      getServiceCapabilitiesIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.capabilities.Integration[], Error>;
}
