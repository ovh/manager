import { useMutation } from '@tanstack/react-query';
import { deleteInstance } from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';

export type TUseDeleteInstanceCallbacks = DeepReadonly<{
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}>;

export const useDeleteInstance = (
  projectId: string,
  { onError, onSuccess }: TUseDeleteInstanceCallbacks = {},
) => {
  const mutationKey = instancesQueryKey(projectId, ['instance', 'delete']);
  const mutationFn = (instanceId: string) =>
    deleteInstance(projectId, instanceId);

  const mutation = useMutation<null, unknown, string, unknown>({
    mutationKey,
    mutationFn,
    onError,
    onSuccess,
  });

  return {
    deleteInstance: mutation.mutate,
    ...mutation,
  };
};
