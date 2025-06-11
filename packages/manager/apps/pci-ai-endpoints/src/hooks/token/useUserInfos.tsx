import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUserPermissions, getUserId } from '@/data/api/policies/user.api';

type UseUserInfosResult = UseQueryResult<boolean, Error>;

const useUserInfos = (projectId?: string): UseUserInfosResult => {
  return useQuery<boolean, Error>({
    queryKey: ['userInfos', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) {
        return false;
      }
      const permissions = await getUserPermissions();
      const user = await getUserId(projectId);

      const hasMatchingPermission = permissions.some((perm: string) => {
        const suffix = perm.split('ai-endpoints-user-')[1];
        return suffix === projectId;
      });

      const isPrivileged = user.group !== 'UNPRIVILEGED';

      return hasMatchingPermission && isPrivileged;
    },
  });
};

export default useUserInfos;
