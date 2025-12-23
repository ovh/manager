import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getIamUser, IamUser } from '@/data/api/iam-users';

export const getGetIamUserQueryKey = (userId: string) => ['iam-users', userId];

export const useGetIamUser = (userId: string) => {
  return useQuery<IamUser, ApiError>({
    queryKey: getGetIamUserQueryKey(userId),
    queryFn: () => getIamUser(userId),
  });
};
