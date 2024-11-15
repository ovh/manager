import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  deleteInstance,
  startInstance,
  stopInstance,
} from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';
import {
  TDeleteInstanceDto,
  TStopInstanceDto,
  TStartInstanceDto,
} from '@/types/instance/api.types';

export type TMutationFnType = 'delete' | 'start' | 'stop';
export type TMutationFnReturnType =
  | TDeleteInstanceDto
  | TStopInstanceDto
  | TStartInstanceDto;
export type TMutationFnVariables = string | null;

export type TUseInstanceActionCallbacks = DeepReadonly<{
  onSuccess?: (data?: TMutationFnReturnType) => void;
  onError?: (error: unknown) => void;
}>;

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
      if (!instanceId) return Promise.reject();
      switch (type) {
        case 'delete':
          return deleteInstance(projectId, instanceId);
        case 'start':
          return startInstance(projectId, instanceId);
        case 'stop':
          return stopInstance(projectId, instanceId);
        default:
          return Promise.reject();
      }
    },
    [projectId, type],
  );

  const mutation = useMutation<
    TMutationFnReturnType,
    unknown,
    TMutationFnVariables,
    unknown
  >({
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
