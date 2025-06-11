import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUserPermissions } from '@/data/api/policies/user.api';

type UseUserInfosResult = UseQueryResult<boolean, Error>;

const useUserInfos = (projectId?: string): UseUserInfosResult => {
  return useQuery<string[], Error, boolean>({
    queryKey: ['userPermissions', projectId],
    queryFn: getUserPermissions,
    select: (permissions) =>
      permissions.some((perm) => {
        const suffix = perm.split('ai-endpoints-user-')[1];
        return suffix === projectId;
      }),
    enabled: !!projectId,
  });
};

export default useUserInfos;
