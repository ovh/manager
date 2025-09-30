import { useMutation, useQueryClient } from '@tanstack/react-query';
import user from '@/types/User';
import { UserProps, addS3Credentials } from '@/data/api/user/user.api';
import { ObjStoError } from '@/data/api';

export interface UseAddS3User {
  onError: (cause: ObjStoError) => void;
  onSuccess: (user: user.S3CredentialsWithSecret) => void;
}

export function useAddS3User({
  onError,
  onSuccess: customOnSuccess,
}: UseAddS3User) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userInfo: UserProps) => {
      return addS3Credentials(userInfo);
    },
    onError,
    onSuccess: (userInfo, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'user'],
      });
      customOnSuccess(userInfo);
    },
  });

  return {
    addS3User: (userInfo: UserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
