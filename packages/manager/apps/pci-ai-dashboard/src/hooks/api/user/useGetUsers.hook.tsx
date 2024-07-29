import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getUsers } from '@/data/api/user/user.api';
import * as user from '@/types/cloud/user';

export function useGetUsers(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'user'];
  return useQuery({
    queryKey,
    queryFn: () => getUsers({ projectId }),
    ...options,
  }) as UseQueryResult<user.User[], Error>;
}
