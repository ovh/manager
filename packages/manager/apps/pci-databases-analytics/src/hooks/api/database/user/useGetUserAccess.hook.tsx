import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';
import { getUserAccess } from '@/data/api/database/user.api';

export function useGetUserAccess(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  userId: string,
  options?: OptionsFor<typeof getUserAccess>,
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'user',
    userId,
    'access',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUserAccess({ projectId, engine, serviceId, userId }),
    ...options,
  });
}
