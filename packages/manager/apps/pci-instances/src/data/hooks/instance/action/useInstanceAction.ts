import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  deleteInstance,
  shelveInstance,
  rebootInstance,
  startInstance,
  stopInstance,
  unshelveInstance,
  reinstallInstance,
  rescueMode,
} from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';
import { TInstanceDto } from '@/types/instance/api.type';

export type TMutationFnType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall';

export type TMutationFnVariables = TInstanceDto | undefined;

export type TUseInstanceActionCallbacks = DeepReadonly<{
  onSuccess?: (data?: null) => void;
  onError?: (error: unknown) => void;
}>;

const unknownError = new Error('Unknwon Error');

type TRescueMutationFnVariables = {
  instance: TInstanceDto;
  imageId: string;
  isRescue: boolean;
};

export const useInstanceRescueAction = (
  projectId: string,
  { onError, onSuccess }: TUseInstanceActionCallbacks = {},
) => {
  const mutationKey = instancesQueryKey(projectId, ['instance', 'rescue']);
  const mutationFn = useCallback(
    ({ instance, imageId, isRescue }: TRescueMutationFnVariables) => {
      const { id } = instance;
      return rescueMode({ projectId, instanceId: id, imageId, isRescue });
    },
    [projectId],
  );

  const mutation = useMutation<
    null,
    unknown,
    TRescueMutationFnVariables,
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

export const useBaseInstanceAction = (
  type: TMutationFnType | null,
  projectId: string,
  { onError, onSuccess }: TUseInstanceActionCallbacks = {},
) => {
  const mutationKey = instancesQueryKey(projectId, [
    'instance',
    ...(type !== null ? [type] : []),
  ]);
  const mutationFn = useCallback(
    (instance?: TInstanceDto) => {
      if (!instance) return Promise.reject(unknownError);
      const { id, imageId } = instance;
      switch (type) {
        case 'delete':
          return deleteInstance(projectId, id);
        case 'start':
          return startInstance(projectId, id);
        case 'stop':
          return stopInstance(projectId, id);
        case 'shelve':
          return shelveInstance(projectId, id);
        case 'unshelve':
          return unshelveInstance(projectId, id);
        case 'soft-reboot':
          return rebootInstance({
            projectId,
            instanceId: id,
            rebootType: 'soft',
          });
        case 'hard-reboot':
          return rebootInstance({
            projectId,
            instanceId: id,
            rebootType: 'hard',
          });
        case 'reinstall':
          return reinstallInstance(projectId, id, imageId);
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
