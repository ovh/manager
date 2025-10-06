import { useMemo } from 'react';

import { useKubeDetail } from '@/api/hooks/useKubernetes';
import { useAvailablePrivateNetworks } from '@/api/hooks/useNetwork';
import { useRegionSubnets } from '@/api/hooks/useSubnets';

export interface UseKubeNetworkProps {
  projectId: string;
  kubeId: string;
}

export const useKubeNetwork = ({ projectId, kubeId }: Readonly<UseKubeNetworkProps>) => {
  const { data: kubeDetail, isPending: isKubePending } = useKubeDetail(projectId, kubeId);

  const { data: availablePrivateNetworks, isPending: isPrivateNetworksPending } =
    useAvailablePrivateNetworks(projectId, kubeDetail?.region);

  const { data: availableSubnets, isPending: isSubnetPending } = useRegionSubnets(
    projectId,
    kubeDetail?.region,
    kubeDetail?.privateNetworkId,
  );

  const isPending = isKubePending || isPrivateNetworksPending || isSubnetPending;

  const kubePrivateNetwork = useMemo(
    () =>
      isPending
        ? null
        : availablePrivateNetworks.find((network) => network.id === kubeDetail.privateNetworkId),
    [isPending],
  );

  const kubeSubnet = useMemo(
    () => (isPending ? null : availableSubnets.find((sub) => sub.id === kubeDetail.nodesSubnetId)),

    [isPending],
  );

  return {
    availablePrivateNetworks,
    availableSubnets,
    kubeDetail,
    kubePrivateNetwork,
    kubeSubnet,
    isPending,
  };
};
