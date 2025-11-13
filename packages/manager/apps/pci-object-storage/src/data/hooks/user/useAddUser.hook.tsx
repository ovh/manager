import { useMutation, useQueryClient } from '@tanstack/react-query';
import user from '@/types/User';
import { AddUserProps, addUser } from '@/data/api/user/user.api';
import { ObjStoError } from '@/data/api';

export interface UseAddUser {
  onError: (cause: ObjStoError) => void;
  onSuccess: (user: user.UserDetail) => void;
}

export function useAddUser({
  onError,
  onSuccess: customOnSuccess,
}: UseAddUser) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userInfo: AddUserProps) => {
      return addUser(userInfo);
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
    addUser: (userInfo: AddUserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
