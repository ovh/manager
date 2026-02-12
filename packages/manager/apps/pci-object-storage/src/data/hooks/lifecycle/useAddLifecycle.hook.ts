import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLifecycle } from '@/data/api/lifecycle/lifecycle.api';
import { getS3Lifecycle } from '@/data/api/storage/s3Storage.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getLifecycleQueryKey } from './lifecycleQueryKey';

type UseAddLifecycleParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export interface AddLifecycleParams {
  projectId: string;
  region: string;
  name: string;
  lifecycleRule: storages.LifecycleRule;
}

export function useAddLifecycle({ onSuccess, onError }: UseAddLifecycleParams) {
  const queryClient = useQueryClient();
  const { mutate: addLifecycleMutation, isPending } = useMutation({
    mutationFn: async (data: AddLifecycleParams) => {
      const queryKey = getLifecycleQueryKey(data);
      const existing = await queryClient.fetchQuery({
        queryKey,
        queryFn: () =>
          getS3Lifecycle({
            projectId: data.projectId,
            region: data.region,
            name: data.name,
          }),
      });

      const existingRules = existing?.rules || [];
      const updatedRules = [...existingRules, data.lifecycleRule];

      return updateLifecycle({
        projectId: data.projectId,
        region: data.region,
        name: data.name,
        lifecycleRules: updatedRules,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: getLifecycleQueryKey(variables),
      });
      onSuccess?.();
    },
    onError,
  });

  return { addLifecycle: addLifecycleMutation, isPending };
}
