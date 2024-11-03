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
) =>
  useQuery({
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
    throwOnError: true,
  });

export const useGetRegionPrivateNetworks = (
  projectId: string,
  region: string,
) => {
  const query = useQuery({
    queryKey: ['project', projectId, 'region', region, 'networks'],
    queryFn: () => getRegionPrivateNetworks(projectId, region),
    enabled: !!projectId && !!region,
    throwOnError: true,
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
