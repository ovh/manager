import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { networkApi } from '@/data/networkapi';
import { NetworkTypeEnum } from '@/models/vrack';

/**
 * Fetch networks and only return the ones that
 * are private and in the provided region
 * @param projectId the cloud project id
 * @param region the short name for the region (ex: GRA, BHS)
 * @returns states for network and subnet selection, networks and subnets lists, queries statuses
 */
export function useVrack(projectId: string, region: string) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedSubnet, setSelectedSubnet] = useState<string>('');
  // define queries
  const networkQuery = useQuery({
    queryKey: [projectId, '/network/private'],
    queryFn: () => networkApi.getPrivateNetworks(projectId),
  });
  const subnetQuery = useQuery({
    queryKey: [projectId, '/network/private', selectedNetwork, '/subnet'],
    queryFn: () => networkApi.getSubnets(projectId, selectedNetwork),
    enabled: false,
  });
  // create lists based on queries responses
  const networks = useMemo(
    () =>
      networkQuery.data?.filter(
        (network) =>
          network.type === NetworkTypeEnum.private &&
          network.regions.filter((networkRegion) =>
            networkRegion.region.startsWith(region),
          ).length > 0,
      ) || [],
    [networkQuery.data, region],
  );
  const subnets = useMemo(() => subnetQuery.data || [], [subnetQuery.data]);
  // pre select first item of the lists on change
  useEffect(() => {
    setSelectedNetwork(networks[0]?.id || '');
  }, [networks]);
  useEffect(() => {
    setSelectedSubnet(subnets[0]?.id || '');
  }, [subnets]);
  // fetch the subnets of the selected network when selected
  useEffect(() => {
    if (selectedNetwork.length > 0) {
      subnetQuery.refetch();
    }
  }, [selectedNetwork]);
  return {
    networkQuery,
    subnetQuery,
    selectedNetwork,
    setSelectedNetwork,
    networks,
    selectedSubnet,
    setSelectedSubnet,
    subnets,
  };
}
