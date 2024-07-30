import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAllPrivateNetworks, TNetwork } from '../data/network';

const getQueryKeyPrivateNetworks = (projectId: string) => [
  'project',
  projectId,
  'privateNetworks',
];

export const useAllPrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworks(projectId),
    queryFn: () => getAllPrivateNetworks(projectId),
    throwOnError: true,
  });

export const useAvailablePrivateNetworks = (
  projectId: string,
  regionName: string,
) => {
  const {
    data: privateNetworks,
    error,
    isLoading,
    isPending,
  } = useAllPrivateNetworks(projectId);

  const availablePrivateNetworks = useMemo(() => {
    const filteredPrivateNetworks = privateNetworks?.filter((network) =>
      network.regions.find(
        (region) => region.region === regionName && region.status === 'ACTIVE',
      ),
    );
    return filteredPrivateNetworks
      ?.map((network) => ({
        ...network,
        name: `${network.vlanId.toString().padStart(4, '0')} - ${network.name}`,
        clusterRegion: network.regions.find(
          (_region) =>
            _region.status === 'ACTIVE' && _region.region === regionName,
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [privateNetworks]);

  return {
    data: availablePrivateNetworks,
    error,
    isLoading,
    isPending,
  };
};
