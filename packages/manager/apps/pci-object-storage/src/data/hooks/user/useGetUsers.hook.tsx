import { getUsers } from '@/data/api/user/user.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetUsers(
  projectId: string,
  options?: OptionsFor<typeof getUsers>,
) {
  const queryKey = [projectId, 'user'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUsers({ projectId }),
    ...options,
  });
}
