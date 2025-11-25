import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getIamUser, IamUser } from '@/data/api/iam-users';

export const useGetIamUser = (
  userId: string,
  ) => {
  return useQuery<IamUser, ApiError>({
    queryKey: ['iam-users', userId],
    queryFn: () => getIamUser(userId),
  })
};
