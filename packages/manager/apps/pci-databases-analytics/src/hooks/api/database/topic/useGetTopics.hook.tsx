import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getTopics } from '@/data/api/database/topic.api';

export function useGetTopics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'topic'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getTopics({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.kafka.Topic[], Error>;
}
