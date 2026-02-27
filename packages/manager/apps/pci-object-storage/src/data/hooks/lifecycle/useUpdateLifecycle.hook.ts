import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLifecycle } from '@/data/api/lifecycle/lifecycle.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getLifecycleQueryKey } from './lifecycleQueryKey';
import { useFetchLifecycleRules } from './useFetchLifecycleRules.hook';

type UseUpdateLifecycleParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export interface UpdateLifecycleParams {
  projectId: string;
  region: string;
  name: string;
  lifecycleRule: storages.LifecycleRule;
}

export function useUpdateLifecycle({
  onSuccess,
  onError,
}: UseUpdateLifecycleParams) {
  const queryClient = useQueryClient();
  const { fetchLifecycleRules } = useFetchLifecycleRules();

  const { mutate: updateLifecycleMutation, isPending } = useMutation({
    mutationFn: async (data: UpdateLifecycleParams) => {
      const existingRules = await fetchLifecycleRules(data);
      const updatedRules = existingRules.map((rule) =>
        rule.id === data.lifecycleRule.id ? data.lifecycleRule : rule,
      );

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

  return { updateLifecycle: updateLifecycleMutation, isPending };
}
