import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getAllPrivateNetworks,
  getAllPrivateNetworksByRegion,
  getListGateways,
} from '../data/network';

const getListGatewaysQueryKey = (
  projectId: string,
  regionName: string,
  subnetId,
) => [
  'project',
  projectId,
  'region',
  regionName,
  'gateways',
  'subnet',
  subnetId,
];

const getQueryKeyPrivateNetworks = (projectId: string) => [
  'project',
  projectId,
  'privateNetworks',
];

export const getQueryKeyPrivateNetworksByRegion = (
  projectId: string,
  regionName: string,
) => [...getQueryKeyPrivateNetworks(projectId), 'regionName', regionName];

export const useAllPrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworks(projectId),
    queryFn: () => getAllPrivateNetworks(projectId),
    throwOnError: true,
  });

export const usePrivateNetworkByRegion = (
  projectId: string,
  regionName: string,
) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworksByRegion(projectId, regionName),
    queryFn: () => getAllPrivateNetworksByRegion(projectId, regionName),
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
  } = usePrivateNetworkByRegion(projectId, regionName);

  const availablePrivateNetworks = useMemo(() => {
    const filteredPrivateNetworks = privateNetworks?.filter(
      (network) => network.vlanId !== null,
    );
    return filteredPrivateNetworks
      ?.map((network) => ({
        ...network,
        name: `${network.vlanId?.toString().padStart(4, '0')} - ${
          network.name
        }`,
        clusterRegion: regionName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [privateNetworks, regionName]);

  return {
    data: availablePrivateNetworks,
    error,
    isLoading,
    isPending,
  };
};

export const useListGateways = (
  projectId: string,
  regionName: string,
  subnetId: string,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: getListGatewaysQueryKey(projectId, regionName, subnetId),
    queryFn: () => getListGateways(projectId, regionName, subnetId),
    enabled: !!projectId && !!regionName && !!subnetId,
  });

  return {
    data,
    error,
    isLoading,
  };
};
