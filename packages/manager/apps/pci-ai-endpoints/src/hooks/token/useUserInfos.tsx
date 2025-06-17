import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUserPermissions } from '@/data/api/policies/user.api';

type UseUserInfosResult = UseQueryResult<boolean, Error>;

const useUserInfos = (projectId?: string): UseUserInfosResult => {
  return useQuery<boolean, Error>({
    queryKey: ['userInfos', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const permissions = await getUserPermissions();

      const hasMatchingPermission = permissions.some((perm: string) => {
        const suffix = perm.split('ai-endpoints-user-')[1];
        return suffix === projectId;
      });

      return hasMatchingPermission;
    },
  });
};

export default useUserInfos;
