import { useState, useEffect } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useGetPrivateNetworks } from '@/data/hooks/networks/useNetworks';
import { TNetwork } from '@/types/network.type';

type GetPrivateNetwork = {
  isLoading: boolean;
  network: TNetwork;
};

export default function usePrivateNetwork(
  networkId: string,
): GetPrivateNetwork {
  const [network, setNetwork] = useState<TNetwork>();
  const { data: project } = useProject();
  const { data: networks, isLoading } = useGetPrivateNetworks(
    project.project_id,
  );

  useEffect(() => {
    const data = networks?.find((item) => item.id === networkId);

    if (data) {
      setNetwork(data);
    }
  }, [networks]);

  return { isLoading, network };
}
