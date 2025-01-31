import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getPatterns } from '@/data/api/database/pattern.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetPatterns(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'pattern'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getPatterns({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.opensearch.Pattern[], Error>;
}
