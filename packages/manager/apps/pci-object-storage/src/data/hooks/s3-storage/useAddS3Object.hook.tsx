import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  AddS3ObjectParams,
  addS3Object,
} from '@/data/api/storage/s3Storage.api';

interface UseAddS3Object {
  onError: (cause: ObjStoError) => void;
  onAddSuccess: () => void;
}
export function useAddS3Object({ onError, onAddSuccess }: UseAddS3Object) {
  const { projectId, region, s3Name } = useParams();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (s3ObjectInfo: AddS3ObjectParams) => {
      return addS3Object(s3ObjectInfo);
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
      onAddSuccess();
    },
  });

  return {
    addS3Object: (s3ObjectInfo: AddS3ObjectParams) => {
      return mutation.mutate(s3ObjectInfo);
    },
    ...mutation,
  };
}
