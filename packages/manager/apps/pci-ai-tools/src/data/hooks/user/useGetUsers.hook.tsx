import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as user from '@datatr-ux/ovhcloud-types/cloud/user/index';
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
