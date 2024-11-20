import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  deleteInstance,
  startInstance,
  stopInstance,
} from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';

export type TMutationFnType = 'delete' | 'start' | 'stop';
export type TMutationFnVariables = string | null;

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
    (instanceId: string | null) => {
      if (!instanceId) return Promise.reject(unknownError);
      switch (type) {
        case 'delete':
          return deleteInstance(projectId, instanceId);
        case 'start':
          return startInstance(projectId, instanceId);
        case 'stop':
          return stopInstance(projectId, instanceId);
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
