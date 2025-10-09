import { useMutation } from '@tanstack/react-query';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import { ObjStoError } from '@/data/api';
import {
  UpdateS3Data,
  udpateS3Storage,
} from '@/data/api/storage/s3Storage.api';
import queryClient from '@/query.client';

interface UseUpdateS3 {
  onError: (cause: ObjStoError) => void;
  onSuccess: (s3: StorageContainer) => void;
}
export function useUpdateS3({
  onError,
  onSuccess: customOnSuccess,
}: UseUpdateS3) {
  const mutation = useMutation({
    mutationFn: (s3Info: UpdateS3Data) => {
      return udpateS3Storage(s3Info);
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
        ],
      });
      customOnSuccess(_data);
    },
  });

  return {
    udpateS3Storage: (s3Info: UpdateS3Data) => {
      return mutation.mutate(s3Info);
    },
    ...mutation,
  };
}
