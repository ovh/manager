import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLifecycle } from '@/data/api/lifecycle/lifecycle.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getLifecycleQueryKey } from './lifecycleQueryKey';
import { useFetchLifecycleRules } from './useFetchLifecycleRules.hook';

export interface ToggleLifecycleStatusParams {
  projectId: string;
  region: string;
  name: string;
  ruleId: string;
  enable: boolean;
}

type UseToggleLifecycleStatusParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useToggleLifecycleStatus({
  onSuccess,
  onError,
}: UseToggleLifecycleStatusParams) {
  const queryClient = useQueryClient();
  const { fetchLifecycleRules } = useFetchLifecycleRules();

  const { mutate: toggleLifecycleStatus, isPending } = useMutation({
    mutationFn: async (data: ToggleLifecycleStatusParams) => {
      const existingRules = await fetchLifecycleRules(data);
      const updatedRules = existingRules.map((rule) =>
        rule.id === data.ruleId
          ? {
              ...rule,
              status: data.enable
                ? storages.LifecycleRuleStatusEnum.enabled
                : storages.LifecycleRuleStatusEnum.disabled,
            }
          : rule,
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

  return { toggleLifecycleStatus, isPending };
}
