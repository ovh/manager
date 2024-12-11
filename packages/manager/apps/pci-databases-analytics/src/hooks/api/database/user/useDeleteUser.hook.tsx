import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteUser, deleteUser } from '@/data/api/database/user.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteUser {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteUser({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteUser) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userInfo: DeleteUser) => {
      return deleteUser(userInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'user',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteUser: (userInfo: DeleteUser) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
