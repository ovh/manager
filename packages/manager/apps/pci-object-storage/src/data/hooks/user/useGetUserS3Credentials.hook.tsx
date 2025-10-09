import { getUserS3Credentials } from '@/data/api/user/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetUserS3Credentials(
  projectId: string,
  userId: number,
  options?: OptionsFor<typeof getUserS3Credentials>,
) {
  const queryKey = [projectId, 'user', String(userId), 's3Credentials'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUserS3Credentials({ projectId, userId }),
    ...options,
  });
}
