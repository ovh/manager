import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getAdvancedConfigurationCapabilities } from '@/data/api/database/advancedConfiguration.api';
import { CdbError } from '@/data/api/database';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getAdvancedConfigurationCapabilities({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<
    database.capabilities.advancedConfiguration.Property[],
    CdbError
  >;
}
