import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import {
  QueryStatistics,
  getQueryStatistics,
} from '@/data/api/database/queries.api';

export function useGetQueryStatistics(
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
    'queryStatistics',
  ];
  return useQuery({
    queryKey,
    queryFn: () => getQueryStatistics({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<QueryStatistics[], Error>;
}
