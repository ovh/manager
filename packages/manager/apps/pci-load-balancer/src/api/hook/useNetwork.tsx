import { useQuery } from '@tanstack/react-query';
import {
  getPrivateNetworkByRegion,
  getPrivateNetworks,
  getPrivateNetworkSubnets,
  getSubnetByNetworkAndRegion,
} from '../data/network';

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
