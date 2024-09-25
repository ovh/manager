import { useQuery } from '@tanstack/react-query';
import {
  getPrivateNetworkByRegion,
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
    enabled: !!networkId,
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
