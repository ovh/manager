import { getConnectionPools } from '@/data/api/database/connectionPool.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import * as database from '@/types/cloud/project/database';

export function useGetConnectionPools(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getConnectionPools>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'connectionPool'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnectionPools({ projectId, engine, serviceId }),
    ...options,
  });
}
