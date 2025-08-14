import { useMemo } from 'react';
import { useNetwork } from '@/data/hooks/network/useNetwork';
import { useDashboard } from './useDashboard';
import { selectUnattachedPrivateNetwork } from '../view-models/selectUnattachedNetwork';

type TUseUnattachedPrivateNetwork = {
  projectId: string;
  regionId: string;
  instanceId: string;
};

export const useUnattachedPrivateNetwork = ({
  projectId,
  regionId,
  instanceId,
}: TUseUnattachedPrivateNetwork) => {
  const { instance, isPending: isInstancePending } = useDashboard({
    region: regionId,
    instanceId,
  });
  const { data: networks, isPending: isNetworkPending } = useNetwork(
    projectId,
    regionId,
  );

  return useMemo(
    () => ({
      instance: instance?.name ?? '',
      networks:
        instance?.addresses && networks
          ? selectUnattachedPrivateNetwork(networks, instance.addresses)
          : [],
      isPending: isInstancePending || isNetworkPending,
    }),
    [instance, networks, isInstancePending, isNetworkPending],
  );
};
