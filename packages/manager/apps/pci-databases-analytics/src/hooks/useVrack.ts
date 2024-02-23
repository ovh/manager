import { useEffect, useMemo, useState } from 'react';
import { NetworkTypeEnum } from '@/models/network';
import { useGetNetwork, useGetSubnet } from './api/network.api.hooks';

/**
 * Fetch networks and only return the ones that
 * are private and in the provided region
 * @param projectId the cloud project id
 * @param region the short name for the region (ex: GRA, BHS)
 * @returns states for network and subnet selection, networks and subnets lists, queries statuses
 */
export function useVrack(
  projectId: string,
  region: string,
  networkId?: string,
) {
  const [id, setId] = useState(networkId);
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
  const subnets = useMemo(() => subnetQuery.data || [], [subnetQuery.data]);
  // fetch the subnets of the selected network when selected
  useEffect(() => {
    if (id) {
      subnetQuery.refetch();
    }
  }, [id]);
  return {
    networkQuery,
    subnetQuery,
    networks,
    subnets,
    setId,
  };
}
