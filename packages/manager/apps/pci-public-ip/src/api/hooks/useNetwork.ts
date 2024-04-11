import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Region } from '@/api/data/project';
import {
  getAggregatedNetwork,
  getAllPrivateNetworks,
} from '@/api/data/network';

export const useAggregatedPrivateNetworks = (
  projectId: string,
  customerRegions: Region[],
) => {
  return useQuery({
    queryKey: ['aggregated-network', projectId],
    queryFn: () => getAggregatedNetwork(projectId),
    enabled: customerRegions?.length > 0,
    select: (data) => {
      const privateNetworks = {};
      const localZones =
        customerRegions?.filter(({ type }) => type.includes('localzone')) || [];
      data.resources?.forEach((network) => {
        if (
          network.visibility === 'private' &&
          !localZones?.some((region) => region.name === network.region)
        ) {
          if (!privateNetworks[network.vlanId]) {
            const { id, region, ...rest } = network;
            privateNetworks[network.vlanId] = {
              ...rest,
              region,
              subnets: [{ region, networkId: id }],
            };
          } else {
            const { id, region } = network;
            privateNetworks[network.vlanId].subnets.push({
              region,
              networkId: id,
            });
          }
        }
      });
      return Object.values(privateNetworks);
    },
  });
};

interface Subnet {
  region: string;
  id: string;
}

export const useAggregatedPrivateNetworksRegions = (
  projectId: string,
  customerRegions: Region[],
) => {
  const privateNetworksQuery = useAggregatedPrivateNetworks(
    projectId,
    customerRegions,
  );
  const { data } = privateNetworksQuery;

  return {
    ...privateNetworksQuery,
    data: useMemo(
      () =>
        Array.from(
          new Set(
            data?.reduce<string[]>(
              (result: string[], network: { subnets: Subnet[] }) =>
                result.concat(network.subnets.map(({ region }) => region)),
              [],
            ),
          ),
        ),
      [data],
    ),
  };
};

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
