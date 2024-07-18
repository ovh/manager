import { useMutation } from '@tanstack/react-query';
import { EditUser, GenericUser, editUser } from '@/data/api/database/user.api';
import { CdbError } from '@/data/api/database';

export interface UseEditUser {
  onError: (cause: CdbError) => void;
  onSuccess: (user: GenericUser) => void;
}
export function useEditUser({ onError, onSuccess }: UseEditUser) {
  const mutation = useMutation({
    mutationFn: (userInfo: EditUser) => {
      return editUser(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editUser: (userInfo: EditUser) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
