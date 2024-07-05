import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  QueryStatistics,
  getQueryStatistics,
} from '@/data/api/database/queries.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQueryStatistics({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<QueryStatistics[], Error>;
}
