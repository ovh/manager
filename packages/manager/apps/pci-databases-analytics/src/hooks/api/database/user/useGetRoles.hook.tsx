import * as database from '@/types/cloud/project/database';
import { getRoles } from '@/data/api/database/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetRoles(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getRoles>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'roles'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRoles({ projectId, engine, serviceId }),
    ...options,
  });
}
