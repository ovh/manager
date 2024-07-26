import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getServiceIntegrations } from '@/data/api/database/integration.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'integration'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Integration[], Error>;
}
