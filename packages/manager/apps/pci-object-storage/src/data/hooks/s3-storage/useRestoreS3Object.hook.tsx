import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  RestoreS3ObjectParams,
  restoreS3Object,
} from '@/data/api/storage/s3Storage.api';

interface UseRestoreS3Object {
  onError: (cause: ObjStoError) => void;
  onRestoreSuccess: () => void;
}
export function useRestoreS3Object({
  onError,
  onRestoreSuccess,
}: UseRestoreS3Object) {
  const { projectId, region, s3Name } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (s3ObjectInfo: RestoreS3ObjectParams) => {
      return restoreS3Object(s3ObjectInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate storage queries
      queryClient.invalidateQueries({
        queryKey: [projectId, 'region', region, 'storage', s3Name],
      });
      // Invalidate s3-browser queries to refresh the object list
      queryClient.invalidateQueries({
        queryKey: ['s3-browser', projectId, region, s3Name],
      });
      onRestoreSuccess();
    },
  });

  return {
    restoreS3Object: (s3ObjectInfo: RestoreS3ObjectParams) => {
      return mutation.mutate(s3ObjectInfo);
    },
    ...mutation,
  };
}
