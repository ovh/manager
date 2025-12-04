import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import { S3Data, deleteS3Storage } from '@/data/api/storage/s3Storage.api';

interface UseDeleteS3 {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteS3({ onError, onDeleteSuccess }: UseDeleteS3) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (info: S3Data) => {
      return deleteS3Storage(info);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'storages'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteS3: (storageInfo: S3Data) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
