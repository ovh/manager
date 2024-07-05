import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getAdvancedConfiguration } from '@/data/api/database/advancedConfiguration.api';
import { CdbError } from '@/data/api/database';

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
  return useQuery({
    queryKey,
    queryFn: () => getAdvancedConfiguration({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<Record<string, string>, CdbError>;
}
