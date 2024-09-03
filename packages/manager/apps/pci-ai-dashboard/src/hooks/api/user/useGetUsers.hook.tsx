import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getUsers } from '@/data/api/user/user.api';
import * as user from '@/types/cloud/user';
import { useQueryImmediateRefetch } from '../useImmediateRefetch.hook';

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
