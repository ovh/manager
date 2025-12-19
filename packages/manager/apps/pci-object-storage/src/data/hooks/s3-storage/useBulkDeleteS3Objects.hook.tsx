import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ObjStoError } from '@/data/api';
import {
  BulkDeleteS3ObjectsParams,
  bulkDeleteS3Objects,
} from '@/data/api/storage/s3Storage.api';

interface UseBulkDeleteS3Objects {
  onError: (cause: ObjStoError) => void;
  onDeleteSuccess: () => void;
}

export function useBulkDeleteS3Objects({
  onError,
  onDeleteSuccess,
}: UseBulkDeleteS3Objects) {
  const { projectId, region, s3Name } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: BulkDeleteS3ObjectsParams) => {
      return bulkDeleteS3Objects(params);
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
    bulkDeleteS3Objects: (params: BulkDeleteS3ObjectsParams) => {
      return mutation.mutate(params);
    },
    ...mutation,
  };
}
