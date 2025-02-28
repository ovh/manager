import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  deleteInstance,
  shelveInstance,
  rebootInstance,
  startInstance,
  stopInstance,
  unshelveInstance,
} from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';

export type TMutationFnType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot';

export type TMutationFnVariables = string | undefined;

export type TUseInstanceActionCallbacks = DeepReadonly<{
  onSuccess?: (data?: null) => void;
  onError?: (error: unknown) => void;
}>;

const unknownError = new Error('Unknwon Error');

export const useInstanceAction = (
  type: TMutationFnType | null,
  projectId: string,
  { onError, onSuccess }: TUseInstanceActionCallbacks = {},
) => {
  const mutationKey = instancesQueryKey(projectId, [
    'instance',
    ...(type !== null ? [type] : []),
  ]);
  const mutationFn = useCallback(
    (instanceId?: string) => {
      if (!instanceId) return Promise.reject(unknownError);
      switch (type) {
        case 'delete':
          return deleteInstance(projectId, instanceId);
        case 'start':
          return startInstance(projectId, instanceId);
        case 'stop':
          return stopInstance(projectId, instanceId);
        case 'shelve':
          return shelveInstance(projectId, instanceId);
        case 'unshelve':
          return unshelveInstance(projectId, instanceId);
        case 'soft-reboot':
          return rebootInstance({ projectId, instanceId, rebootType: 'soft' });
        default:
          return Promise.reject(unknownError);
      }
    },
    [projectId, type],
  );

  const mutation = useMutation<null, unknown, TMutationFnVariables, unknown>({
    mutationKey,
    mutationFn,
    onError,
    onSuccess,
  });

  return {
    mutationHandler: mutation.mutate,
    ...mutation,
  };
};
