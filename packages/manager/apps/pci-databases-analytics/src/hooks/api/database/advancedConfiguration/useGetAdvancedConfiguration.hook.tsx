import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getAdvancedConfiguration } from '@/data/api/database/advancedConfiguration.api';
import { CdbError } from '@/data/api/database';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetAdvancedConfiguration(
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
    'advancedConfiguration',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getAdvancedConfiguration({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<Record<string, string>, CdbError>;
}
