import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAllInstance } from '@/api/data/instance';
import { FloatingIP, Instance } from '@/interface';
import { useAllAssociatedInstances } from './useFloatingIP';
import { useGatewayDetails } from './useGateway';
import { getPrivateNetworkIdFromGateway } from '@/utils';
import { useAllPrivateNetworks } from './useNetwork';

export const useAllInstance = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'instance'],
    queryFn: () => getAllInstance(projectId),
    throwOnError: true,
  });
};

export const useFilteredInstance = (
  projectId: string,
  floatingIP: FloatingIP,
) => {
  const {
    data: privateNetworks,
    isPending: isPendingNetwork,
  } = useAllPrivateNetworks(projectId || '');

  const { data: instances, isPending: isPendingInstance } = useAllInstance(
    projectId,
  );

  const {
    data: associatedInstances,
    isPending: isPendingAssociatedInstance,
  } = useAllAssociatedInstances(projectId || '', floatingIP?.region);

  const {
    data: gatewayDetails,
    isPending: isPendingGatewayDetails,
  } = useGatewayDetails(
    projectId,
    floatingIP?.region,
    floatingIP?.associatedEntity.gatewayId,
  );

  const filteredInstances = useMemo(() => {
    let newInstances: Instance[] = [];
    if (instances?.length && associatedInstances?.length) {
      const associatedInstance = associatedInstances?.map(
        ({ associatedEntity }) => {
          return associatedEntity?.id ? associatedEntity?.id : null;
        },
      );
      newInstances = instances.filter(
        (instance) =>
          !instance.ipAddresses.some(
            (ipAddress) => ipAddress.type !== 'private',
          ),
      );
      if (associatedInstance) {
        newInstances = newInstances.filter(
          (instance) => !associatedInstance?.includes(instance.id),
        );
      }
      if (!floatingIP?.associatedEntity?.gatewayId) {
        newInstances = newInstances.filter(
          (instance) => instance.region === floatingIP.region,
        );
      } else {
        const privateNetworkId = getPrivateNetworkIdFromGateway(
          privateNetworks,
          gatewayDetails?.interfaces[0]?.networkId,
        );
        newInstances = newInstances.filter((instance) =>
          instance.ipAddresses.find(
            (ipAddress) => ipAddress.networkId === privateNetworkId,
          ),
        );
      }
    }
    return newInstances;
  }, [instances, associatedInstances, gatewayDetails, privateNetworks]);
  return {
    filteredInstances,
    isLoading:
      isPendingNetwork ||
      isPendingInstance ||
      isPendingAssociatedInstance ||
      isPendingGatewayDetails,
  };
};
