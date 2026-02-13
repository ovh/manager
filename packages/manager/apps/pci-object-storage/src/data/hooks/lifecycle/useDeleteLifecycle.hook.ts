import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateLifecycle,
  deleteLifecycle,
} from '@/data/api/lifecycle/lifecycle.api';
import { ObjStoError } from '@/data/api';
import { getLifecycleQueryKey } from './lifecycleQueryKey';
import { useFetchLifecycleRules } from './useFetchLifecycleRules.hook';

export type DeleteLifecycleRuleParams = {
  projectId: string;
  region: string;
  name: string;
  ruleId: string;
};

type UseDeleteLifecycleParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useDeleteLifecycle({
  onSuccess,
  onError,
}: UseDeleteLifecycleParams) {
  const queryClient = useQueryClient();
  const { fetchLifecycleRules } = useFetchLifecycleRules();

  const { mutate: deleteLifecycleMutation, isPending } = useMutation({
    mutationFn: async (data: DeleteLifecycleRuleParams) => {
      const existingRules = await fetchLifecycleRules(data);
      const updatedRules = existingRules.filter(
        (rule) => rule.id !== data.ruleId,
      );

      if (updatedRules.length === 0) {
        return deleteLifecycle({
          projectId: data.projectId,
          region: data.region,
          name: data.name,
        });
      }

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

  return { deleteLifecycle: deleteLifecycleMutation, isPending };
}
