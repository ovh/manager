import { useMemo } from 'react';
import { DefaultError, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNetworks } from '@/data/hooks/network/useNetwork';
import { useDashboard } from './useDashboard';
import {
  selectUnattachedPrivateNetworks,
  selectUnattachedVolumes,
} from '../view-models/selectUnattachedResource';
import { useVolumes } from '@/data/hooks/volume/useVolume';
import { useAttachVolume as useAttachVolumeMutation } from '@/data/hooks/instance/useInstance';
import { TPartialInstance } from '@/types/instance/entity.type';
import { updateAllInstancesFromCache } from '@/adapters/tanstack-query/store/instances/updaters';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { isApiErrorResponse } from '@/utils';

type TUseUnattachedResource = {
  projectId: string;
  region: string;
  instanceId: string;
};

export const useUnattachedPrivateNetworks = ({
  projectId,
  region,
  instanceId,
}: TUseUnattachedResource) => {
  const { instance, isPending: isInstancePending } = useDashboard({
    region,
    instanceId,
  });
  const { data: networks, isPending: isNetworkPending } = useNetworks(
    projectId,
    region,
  );

  return useMemo(
    () => ({
      instance: instance?.name ?? '',
      networks:
        instance?.privateNetwork && networks
          ? selectUnattachedPrivateNetworks(networks, [
              ...instance.privateNetwork.previews,
              ...(instance.privateNetwork.otherNetworks ?? []),
            ])
          : [],
      isPending: isInstancePending || isNetworkPending,
    }),
    [instance, networks, isInstancePending, isNetworkPending],
  );
};

export const useUnattachedVolumes = ({
  projectId,
  region,
  instanceId,
}: TUseUnattachedResource) => {
  const { instance, isPending: isInstancePending } = useDashboard({
    region,
    instanceId,
  });
  const { data: volumes, isPending: isVolumePending } = useVolumes(
    projectId,
    region,
  );

  return useMemo(
    () => ({
      instance,
      volumes:
        instance?.volumes && volumes
          ? selectUnattachedVolumes(
              volumes,
              instance.volumes,
              instance.region.availabilityZone,
            )
          : [],
      isPending: isInstancePending || isVolumePending,
    }),
    [instance, volumes, isInstancePending, isVolumePending],
  );
};

export const useAttachVolume = ({
  projectId,
  region,
  instanceId,
}: TUseUnattachedResource) => {
  const { addError, addSuccess } = useNotifications();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleModalClose = () => navigate('..');
  const { t } = useTranslation('actions');

  const {
    volumes,
    instance,
    isPending: isVolumePending,
  } = useUnattachedVolumes({
    projectId,
    region,
    instanceId,
  });

  const {
    isPending: isAttaching,
    mutate: attachVolume,
  } = useAttachVolumeMutation({
    projectId,
    instanceId,
    callbacks: {
      onSuccess: (_data, variables) => {
        const volume = volumes.find(
          ({ value }) => value === variables.volumeId,
        );
        const newInstance: TPartialInstance = {
          id: instanceId,
          volumes: [
            ...(instance?.volumes ?? []),
            { id: volume!.value, name: volume!.label, size: null }, // TODO: size will be null until we get it from view-model. It will be the case when we need it
          ],
        };

        updateAllInstancesFromCache(queryClient, {
          projectId,
          instance: newInstance,
          region,
        });

        addSuccess(
          t('pci_instances_actions_instance_volume_attach_success_message', {
            volume: volume!.label,
            instance: instance?.name,
          }),
          true,
        );

        handleModalClose();
      },
      onError: (error) => {
        const errorMessage = isApiErrorResponse(error)
          ? error.response?.data.message
          : (error as DefaultError).message;
        addError(
          t('pci_instances_actions_instance_attach_error_message', {
            message: errorMessage,
          }),
          true,
        );
        handleModalClose();
      },
    },
  });

  return useMemo(
    () => ({
      isPending: isVolumePending || isAttaching,
      volumes,
      attachVolume,
    }),
    [attachVolume, isAttaching, isVolumePending, volumes],
  );
};
