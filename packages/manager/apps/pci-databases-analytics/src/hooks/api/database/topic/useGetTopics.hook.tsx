import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getTopics } from '@/data/api/database/topic.api';

export function useGetTopics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getTopics>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'topic'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getTopics({ projectId, engine, serviceId }),
    ...options,
  });
}
