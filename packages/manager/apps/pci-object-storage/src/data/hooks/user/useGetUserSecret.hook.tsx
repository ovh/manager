import { useMutation } from '@tanstack/react-query';
import user from '@/types/User';
import { S3CredsProps, getUserSecretKey } from '@/data/api/user/user.api';
import { ObjStoError } from '@/data/api';

export interface UseGetUserSecret {
  onError: (cause: ObjStoError) => void;
  onSuccess: (secret: user.S3CredentialsSecretOnly) => void;
}

export function useGetUserSecret({
  onError,
  onSuccess: customOnSuccess,
}: UseGetUserSecret) {
  const mutation = useMutation({
    mutationFn: (userInfo: S3CredsProps) => {
      return getUserSecretKey(userInfo);
    },
    onError,
    onSuccess: (userInfo) => {
      customOnSuccess(userInfo);
    },
  });

  return {
    getUserSecret: (userInfo: S3CredsProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
