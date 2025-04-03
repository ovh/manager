import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import user from '@/types/User';
import { getUsers } from '@/data/api/user/user.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetUsers(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'user'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getUsers({ projectId }),
    ...options,
  }) as UseQueryResult<user.User[], Error>;
}
