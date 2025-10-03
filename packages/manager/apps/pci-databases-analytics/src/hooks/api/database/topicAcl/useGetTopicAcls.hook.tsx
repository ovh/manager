import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getTopicAcls } from '@/data/api/database/topicAcl.api';

export function useGetTopicAcls(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getTopicAcls>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'acl'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getTopicAcls({ projectId, engine, serviceId }),
    ...options,
  });
}
