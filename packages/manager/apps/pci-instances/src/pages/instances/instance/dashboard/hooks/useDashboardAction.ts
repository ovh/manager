import { useMemo } from 'react';
import { useNetworks } from '@/data/hooks/network/useNetwork';
import { useDashboard } from './useDashboard';
import {
  selectUnattachedPrivateNetworks,
  selectUnattachedVolumes,
} from '../view-models/selectUnattachedResource';
import { useVolumes } from '@/data/hooks/volume/useVolume';

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
        instance?.addresses && networks
          ? selectUnattachedPrivateNetworks(networks, instance.addresses)
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
      instance: instance?.name ?? '',
      volumes:
        instance?.volumes && volumes
          ? selectUnattachedVolumes(volumes, instance.volumes)
          : [],
      isPending: isInstancePending || isVolumePending,
    }),
    [instance, volumes, isInstancePending, isVolumePending],
  );
};
