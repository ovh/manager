import { getUserRclone } from '@/data/api/user/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetUserRclone(
  projectId: string,
  userId: number,
  region: string,
  options?: OptionsFor<typeof getUserRclone>,
) {
  const queryKey = [projectId, 'user', String(userId), 'rclone'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUserRclone({ projectId, userId, region }),
    ...options,
  });
}
