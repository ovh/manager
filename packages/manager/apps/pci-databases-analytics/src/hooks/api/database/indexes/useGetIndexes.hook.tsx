import { QueryObserverOptions } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getIndexes } from '@/data/api/database/indexes.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetIndexes(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<
    QueryObserverOptions<database.opensearch.Index[], Error>,
    'queryKey'
  > = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'index'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getIndexes({ projectId, engine, serviceId }) as Promise<database.opensearch.Index[]>,
    ...options,
  });
}
