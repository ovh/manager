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
  backupInstance,
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

type TUseInstanceActionParams<V, R> = {
  projectId: string;
  mutationKeySuffix: string | null;
  mutationFn: (variables: V) => Promise<R>;
  callbacks?: TUseInstanceActionCallbacks;
};

const useInstanceAction = <V, R extends null>({
  projectId,
  mutationKeySuffix,
  mutationFn,
  callbacks = {},
}: TUseInstanceActionParams<V, R>) => {
  const { onError, onSuccess } = callbacks;
  const mutationKey = instancesQueryKey(projectId, [
    'instance',
    ...(mutationKeySuffix !== null ? [mutationKeySuffix] : []),
  ]);

  const mutation = useMutation<R, unknown, V>({
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

type TBackupMutationFnVariables = {
  instance: TInstanceDto;
  snapshotName: string;
};

export const useInstanceBackupAction = (
  projectId: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<TBackupMutationFnVariables, null>({
    projectId,
    mutationKeySuffix: 'backup',
    mutationFn: useCallback(
      ({ instance, snapshotName }) => {
        const { id } = instance;
        return backupInstance({
          projectId,
          instanceId: id,
          snapshotName,
        });
      },
      [projectId],
    ),
    callbacks,
  });

type TRescueMutationFnVariables = {
  instance: TInstanceDto;
  imageId: string;
  isRescue: boolean;
};

export const useInstanceRescueAction = (
  projectId: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<TRescueMutationFnVariables, null>({
    projectId,
    mutationKeySuffix: 'rescue',
    mutationFn: useCallback(
      ({ instance, imageId, isRescue }) => {
        const { id } = instance;
        return rescueMode({ projectId, instanceId: id, imageId, isRescue });
      },
      [projectId],
    ),
    callbacks,
  });

export const useBaseInstanceAction = (
  type: TMutationFnType | null,
  projectId: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<TInstanceDto, null>({
    projectId,
    mutationKeySuffix: type,
    mutationFn: useCallback(
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
    ),
    callbacks,
  });
