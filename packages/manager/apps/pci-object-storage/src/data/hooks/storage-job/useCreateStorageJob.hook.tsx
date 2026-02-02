import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createStorageJob,
  CreateStorageJobParams,
} from '@/data/api/storage/s3Storage.api';
import { ObjStoError } from '@/data/api';

type UseCreateStorageJobParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useCreateStorageJob({
  onSuccess,
  onError,
}: UseCreateStorageJobParams) {
  const queryClient = useQueryClient();
  const { mutate: createStorageJobMutation, isPending } = useMutation({
    mutationFn: async (data: CreateStorageJobParams) => {
      return createStorageJob(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'region',
          variables.region,
          'storage',
          variables.name,
        ],
      });
      onSuccess?.();
    },
    onError,
  });

  return { createStorageJob: createStorageJobMutation, isPending };
}
