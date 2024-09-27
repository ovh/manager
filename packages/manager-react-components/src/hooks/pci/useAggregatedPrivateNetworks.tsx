import { useMemo } from 'react';
import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';
import { useQuery } from '@tanstack/react-query';
import { Region } from './useProjectRegions';

export interface Subnet {
  region: string;
  id: string;
}

interface Network {
  id: string;
  name: string;
  region: string;
  visibility: string;
  vlanId: number;
}

export interface AggregatedNetwork {
  resources: Network[];
}

export const getAggregatedNetwork = async (
  projectId: string,
): Promise<AggregatedNetwork> => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  const { data } = await apiClient.v6.get<AggregatedNetwork>(
    `/cloud/project/${projectId}/aggregated/network`,
  );
  return data;
};

export const getAggregatedPrivateNetworksQueryKey = (projectId: string) => [
  'aggregated-network',
  projectId,
];

export const useAggregatedPrivateNetworks = (
  projectId: string,
  customerRegions: Region[],
) => {
  return useQuery({
    queryKey: getAggregatedPrivateNetworksQueryKey(projectId),
    queryFn: () => getAggregatedNetwork(projectId),
    enabled: customerRegions?.length > 0,
    select: (data) => {
      const privateNetworks = {} as Record<number, any>;
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
