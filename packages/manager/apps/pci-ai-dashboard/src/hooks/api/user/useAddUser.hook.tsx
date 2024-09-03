import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { AddUserProps, addUser } from '@/data/api/user/user.api';
import * as user from '@/types/cloud/user';

export interface MutateUserProps {
  onError: (cause: AIError) => void;
  onSuccess: (user: user.UserDetail) => void;
}

export function useAddUser({ onError, onSuccess }: MutateUserProps) {
  const mutation = useMutation({
    mutationFn: (userInfo: AddUserProps) => {
      return addUser(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addUser: (userInfo: AddUserProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
