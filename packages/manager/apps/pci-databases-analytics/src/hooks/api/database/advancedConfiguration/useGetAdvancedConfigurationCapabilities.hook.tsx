import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getAdvancedConfigurationCapabilities } from '@/data/api/database/advancedConfiguration.api';
import { CdbError } from '@/data/api/database';

export function useGetAdvancedConfigurationCapabilities(
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
    'capabilities/advancedConfiguration',
  ];
  return useQuery({
    queryKey,
    queryFn: () =>
      getAdvancedConfigurationCapabilities({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<
    database.capabilities.advancedConfiguration.Property[],
    CdbError
  >;
}
