import { useMutation } from '@tanstack/react-query';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { ObjStoError } from '@/data/api';
import {
  UpdateS3ObjectStorageClassParams,
  updateS3ObjectStorageClass,
} from '@/data/api/storage/s3Storage.api';
import queryClient from '@/query.client';

interface UseUpdateS3ObjectStorageClass {
  onError: (cause: ObjStoError) => void;
  onSuccess: (object: StorageObject) => void;
}

export function useUpdateS3ObjectStorageClass({
  onError,
  onSuccess: customOnSuccess,
}: UseUpdateS3ObjectStorageClass) {
  const mutation = useMutation({
    mutationFn: (params: UpdateS3ObjectStorageClassParams) => {
      return updateS3ObjectStorageClass(params);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'region',
          variables.region,
          'storage',
          variables.name,
          'object',
          variables.key,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'region',
          variables.region,
          'storage',
          variables.name,
          'objects',
        ],
      });
      // Invalidate s3-browser queries to refresh the object list
      queryClient.invalidateQueries({
        queryKey: [
          's3-browser',
          variables.projectId,
          variables.region,
          variables.name,
        ],
      });
      customOnSuccess(_data);
    },
  });

  return {
    updateObjectStorageClass: (params: UpdateS3ObjectStorageClassParams) => {
      return mutation.mutate(params);
    },
    ...mutation,
  };
}
