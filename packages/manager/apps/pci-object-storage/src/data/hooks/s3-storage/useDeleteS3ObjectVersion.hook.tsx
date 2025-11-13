import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjStoError } from '@/data/api';
import {
  S3ObjectsVersionParams,
  deleteS3ObjectVersion,
} from '@/data/api/storage/s3Storage.api';

interface UseDeleteS3ObjectVersion {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}
export function useDeleteS3ObjectVersion({
  onError,
  onDeleteSuccess,
}: UseDeleteS3ObjectVersion) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (s3ObjectVersionInfo: S3ObjectsVersionParams) => {
      return deleteS3ObjectVersion(s3ObjectVersionInfo);
    },
    onError,
    onSuccess: (_data, variable) => {
      queryClient.invalidateQueries({
        queryKey: [
          variable.projectId,
          'region',
          variable.region,
          'storage',
          variable.name,
        ],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteS3ObjectVersion: (s3ObjectVersionInfo: S3ObjectsVersionParams) => {
      return mutation.mutate(s3ObjectVersionInfo);
    },
    ...mutation,
  };
}
