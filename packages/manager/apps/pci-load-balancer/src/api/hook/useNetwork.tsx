import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getPrivateNetworkByRegion,
  getPrivateNetworks,
  getPrivateNetworkSubnets,
  getRegionPrivateNetworks,
  getSubnetByNetworkAndRegion,
} from '../data/network';
import { NETWORK_PRIVATE_VISIBILITY } from '@/constants';
import { useCreateStore } from '@/pages/create/store';
import { FloatingIpSelectionId } from '@/types/floating.type';

export const usePrivateNetworkByRegion = ({
  projectId,
  region,
  networkId,
}: {
  projectId: string;
  region: string;
  networkId: string;
}) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'network', networkId],
    queryFn: () => getPrivateNetworkByRegion(projectId, region, networkId),
    enabled: !!region && !!networkId,
    throwOnError: true,
  });

export const useSubnetByNetworkAndRegion = ({
  projectId,
  region,
  networkId,
  subnetId,
}: {
  projectId: string;
  region: string;
  networkId: string;
  subnetId: string;
}) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      region,
      'network',
      networkId,
      'subnet',
      subnetId,
    ],
    queryFn: () =>
      getSubnetByNetworkAndRegion(projectId, region, networkId, subnetId),
    enabled: !!networkId && !!subnetId,
    throwOnError: true,
  });

export const useGetPrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'private-networks'],
    queryFn: () => getPrivateNetworks(projectId),
    throwOnError: true,
  });

export const useGetPrivateNetworkSubnets = (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const store = useCreateStore();

  const query = useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      region,
      'network',
      networkId,
      'subnets',
    ],
    queryFn: () => getPrivateNetworkSubnets(projectId, region, networkId),
    enabled: !!projectId && !!region && !!networkId,
  });

  const list = useMemo(() => {
    if (!query.data) {
      return [];
    }
    return store.publicIp !== FloatingIpSelectionId.UNATTACHED
      ? query.data.filter((subnet) => subnet.gatewayIp)
      : query.data;
  }, [query.data, store.publicIp]);

  return {
    ...query,
    list,
  };
};

export const getRegionPrivateNetworksQuery = (
  projectId: string,
  region: string,
) => ({
  queryKey: ['project', projectId, 'region', region, 'networks'],
  queryFn: () => getRegionPrivateNetworks(projectId, region),
});

export const useGetRegionPrivateNetworks = (
  projectId: string,
  region: string,
) => {
  const query = useQuery({
    ...getRegionPrivateNetworksQuery(projectId, region),
    enabled: !!projectId && !!region,
  });

  const list = useMemo(
    () =>
      (query.data || []).filter(
        (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
      ),
    [query.data],
  );

  return {
    ...query,
    list,
  };
};
