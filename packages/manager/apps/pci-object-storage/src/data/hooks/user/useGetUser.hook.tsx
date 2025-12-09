import { getUser } from '@/data/api/user/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetUser(
  projectId: string,
  userId: number,
  options?: OptionsFor<typeof getUser>,
) {
  const queryKey = [projectId, 'user', String(userId)];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUser({ projectId, userId }),
    ...options,
  });
}
