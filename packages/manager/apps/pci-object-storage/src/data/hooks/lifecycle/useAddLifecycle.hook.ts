import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLifecycle } from '@/data/api/lifecycle/lifecycle.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getLifecycleQueryKey } from './lifecycleQueryKey';
import { useFetchLifecycleRules } from './useFetchLifecycleRules.hook';

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
  const { fetchLifecycleRules } = useFetchLifecycleRules();

  const { mutate: addLifecycleMutation, isPending } = useMutation({
    mutationFn: async (data: AddLifecycleParams) => {
      const existingRules = await fetchLifecycleRules(data);
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
