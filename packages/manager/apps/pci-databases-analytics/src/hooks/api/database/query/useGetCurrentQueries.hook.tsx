import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getCurrentQueries } from '@/data/api/database/queries.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetCurrentQueries(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'currentQueries'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCurrentQueries({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.currentqueries.Query[], Error>;
}
