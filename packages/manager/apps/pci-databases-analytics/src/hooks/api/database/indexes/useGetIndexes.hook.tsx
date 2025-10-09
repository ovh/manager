import * as database from '@/types/cloud/project/database';
import { getIndexes } from '@/data/api/database/indexes.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetIndexes(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getIndexes>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'index'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getIndexes({ projectId, engine, serviceId }),
    ...options,
  });
}
