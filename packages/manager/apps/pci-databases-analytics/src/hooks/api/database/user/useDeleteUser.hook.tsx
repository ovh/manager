import { useMutation } from '@tanstack/react-query';
import { DeleteUser, deleteUser } from '@/data/api/database/user.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteUser {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteUser({ onError, onSuccess }: UseDeleteUser) {
  const mutation = useMutation({
    mutationFn: (userInfo: DeleteUser) => {
      return deleteUser(userInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteUser: (userInfo: DeleteUser) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
