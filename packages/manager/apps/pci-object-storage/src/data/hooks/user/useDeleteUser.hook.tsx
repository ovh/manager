import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import { S3CredsProps, deleteS3Credentials } from '@/data/api/user/user.api';

interface UseDeleteUser {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteUser({ onError, onDeleteSuccess }: UseDeleteUser) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (userInfo: S3CredsProps) => {
      return deleteS3Credentials(userInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'user'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteUser: (userInfo: S3CredsProps) => {
      return mutation.mutate(userInfo);
    },
    ...mutation,
  };
}
