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
  regionId: string;
  instanceId: string;
};

export const useUnattachedPrivateNetworks = ({
  projectId,
  regionId,
  instanceId,
}: TUseUnattachedResource) => {
  const { instance, isPending: isInstancePending } = useDashboard({
    region: regionId,
    instanceId,
  });
  const { data: networks, isPending: isNetworkPending } = useNetworks(
    projectId,
    regionId,
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
  regionId,
  instanceId,
}: TUseUnattachedResource) => {
  const { instance, isPending: isInstancePending } = useDashboard({
    region: regionId,
    instanceId,
  });
  const { data: volumes, isPending: isVolumePending } = useVolumes(
    projectId,
    regionId,
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
