import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  QueryStatistics,
  getCurrentQueries,
  getQueryStatistics,
} from '@/api/databases/queries';

export function useGetCurrentQueries(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'currentQueries'];
  return useQuery({
    queryKey,
    queryFn: () => getCurrentQueries({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.currentqueries.Query[], Error>;
}

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
