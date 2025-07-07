import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useProductAvailability } from '@ovh-ux/manager-pci-common';
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
  activateMonthlyBilling,
} from '@/data/api/instance';
import { DeepReadonly } from '@/types/utils.type';
import { instancesQueryKey } from '@/utils';
import queryClient from '@/queryClient';
import { updateAllInstancesFromCache } from '@/adapters/tanstack-query/store/instances/updaters';

export type TUseInstanceActionCallbacks<
  TData = unknown,
  TVariables = unknown
> = DeepReadonly<{
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown) => void;
}>;

const unknownError = new Error('Unknwon Error');

type TUseInstanceActionParams<V, R> = {
  projectId: string;
  mutationKeySuffix: string | null;
  region: string;
  mutationFn: (variables: V) => Promise<R>;
  callbacks?: TUseInstanceActionCallbacks<R, V>;
};

const useInstanceAction = <
  V extends { instance: { id: string } },
  R extends null
>({
  projectId,
  mutationKeySuffix,
  region,
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
    onSuccess: (data, variables) => {
      const newInstance = {
        id: variables.instance.id,
        task: { isPending: true, status: null },
        actions: [],
      };

      // TODO: refactor or move it to separate concern
      updateAllInstancesFromCache(queryClient, {
        projectId,
        instance: newInstance,
        region,
      });

      return onSuccess?.(data, variables);
    },
  });

  return {
    mutationHandler: mutation.mutate,
    ...mutation,
  };
};

type TBackupMutationFnVariables = {
  instance: { id: string };
  snapshotName: string;
  distantSnapshot?: {
    name: string;
    region: string;
  };
};

export const useInstanceBackupAction = (
  projectId: string,
  region: string,
  callbacks: TUseInstanceActionCallbacks<
    unknown,
    TBackupMutationFnVariables
  > = {},
) => {
  const { data: productAvailability } = useProductAvailability(projectId, {
    addonFamily: 'snapshot',
  });

  return useInstanceAction<TBackupMutationFnVariables, null>({
    projectId,
    region,
    mutationKeySuffix: 'backup',
    mutationFn: useCallback(
      async ({ instance, snapshotName, distantSnapshot }) => {
        const { id } = instance;
        if (
          distantSnapshot &&
          productAvailability?.plans.find(
            (p) =>
              p.code.startsWith('snapshot.consumption') &&
              p.regions.some(
                (r) => r.name === distantSnapshot.region && !r.enabled,
              ),
          )
        ) {
          await enableRegion({ projectId, region: distantSnapshot.region });
        }

        return backupInstance({
          projectId,
          instanceId: id,
          snapshotName,
          ...(distantSnapshot
            ? {
                distantSnapshotName: distantSnapshot.name,
                distantRegionName: distantSnapshot.region,
              }
            : {}),
        });
      },
      [projectId, productAvailability],
    ),
    callbacks,
  });
};

type TRescueMutationFnVariables = {
  instance: { id: string };
  imageId: string;
  isRescue: boolean;
};

export const useInstanceRescueAction = (
  projectId: string,
  region: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<TRescueMutationFnVariables, null>({
    projectId,
    region,
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

type TReinstallMutationFnVariables = {
  instance: { id: string };
  imageId: string;
};

export const useInstanceReinstallAction = (
  projectId: string,
  region: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<TReinstallMutationFnVariables, null>({
    projectId,
    region,
    mutationKeySuffix: 'reinstall',
    mutationFn: useCallback(
      ({ instance, imageId }) =>
        reinstallInstance(projectId, instance.id, imageId),
      [projectId],
    ),
    callbacks,
  });

export const useBaseInstanceAction = (
  type: string | null,
  projectId: string,
  region: string,
  callbacks: TUseInstanceActionCallbacks = {},
) =>
  useInstanceAction<{ instance: { id: string; imageId: string } }, null>({
    projectId,
    region,
    mutationKeySuffix: type,
    mutationFn: useCallback(
      ({ instance: { id, imageId } }) => {
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
          case 'billing/monthly/activate':
            return activateMonthlyBilling(projectId, id);
          default:
            return Promise.reject(unknownError);
        }
      },
      [projectId, type],
    ),
    callbacks,
  });
