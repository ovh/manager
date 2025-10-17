import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  S3ObjectParams,
  deleteS3Object,
} from '@/data/api/storage/s3Storage.api';

interface UseDeleteS3Object {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}
export function useDeleteS3Object({
  onError,
  onDeleteSuccess,
}: UseDeleteS3Object) {
  const { projectId, region, s3Name } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (s3ObjectInfo: S3ObjectParams) => {
      return deleteS3Object(s3ObjectInfo);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'region', region, 'storage', s3Name],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteS3Object: (s3ObjectInfo: S3ObjectParams) => {
      return mutation.mutate(s3ObjectInfo);
    },
    ...mutation,
  };
}
