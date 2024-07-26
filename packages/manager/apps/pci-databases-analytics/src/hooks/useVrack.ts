import { useEffect, useMemo } from 'react';
import { NetworkTypeEnum } from '@/types/cloud/network';
import { useGetNetwork } from './api/network/useGetNetwork.hook';
import { useGetSubnet } from './api/network/useGetSubnet.hook';

/**
 * Fetch networks and only return the ones that
 * are private and in the provided region
 * @param projectId the cloud project id
 * @param region the short name for the region (ex: GRA, BHS)
 * @param networkId the network used for subnets query
 * @returns Filtered Networks and subnets lists, queries statuses
 */
export function useVrack(
  projectId: string,
  region: string,
  networkId?: string,
) {
  // define queries
  const networkQuery = useGetNetwork(projectId);
  const subnetQuery = useGetSubnet(projectId, networkId, {
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
  const subnets = useMemo(
    () =>
      subnetQuery.data?.filter((subnet) =>
        subnet.ipPools.find((ipPool) => ipPool.region.startsWith(region)),
      ) || [],
    [subnetQuery.data],
  );
  // fetch the subnets of the selected network when selected
  useEffect(() => {
    if (networkId) {
      subnetQuery.refetch();
    }
  }, [networkId]);
  return {
    networkQuery,
    subnetQuery,
    networks,
    subnets,
  };
}
