import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import {
  CreateS3Storage,
  createS3Storage,
} from '@/data/api/storage/s3Storage.api';
import cloud from '@/types/Cloud';

interface UseCreateS3 {
  onError: (cause: ObjStoError) => void;
  onSuccess: (s3Container: cloud.StorageContainer) => void;
}
export function useCreateS3({
  onError,
  onSuccess: customOnSuccess,
}: UseCreateS3) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (storageInfo: CreateS3Storage) => {
      return createS3Storage(storageInfo);
    },
    onError,
    onSuccess: (s3Container, variables) => {
      queryClient.invalidateQueries({
        queryKey: [variables.projectId, 'storages'],
      });
      customOnSuccess(s3Container);
    },
  });

  return {
    createS3: (storageInfo: CreateS3Storage) => {
      return mutation.mutate(storageInfo);
    },
    ...mutation,
  };
}
