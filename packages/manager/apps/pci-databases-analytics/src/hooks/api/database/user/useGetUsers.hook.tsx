import * as database from '@/types/cloud/project/database';
import { getUsers } from '@/data/api/database/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetUsers(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getUsers>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'user'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUsers({ projectId, engine, serviceId }),
    ...options,
  });
}
