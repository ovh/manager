/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */
import { useMemo } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { Region } from './useProjectRegions';

/**
 * @deprecated The interface is deprecated and will be removed in MRC V3.
 */
export interface Subnet {
  region: string;
  id: string;
}

/**
 * @deprecated The interface is deprecated and will be removed in MRC V3.
 */
interface Network {
  id: string;
  name: string;
  region: string;
  visibility: string;
  vlanId: number;
}

/**
 * @deprecated The interface is deprecated and will be removed in MRC V3.
 */
export interface AggregatedNetwork {
  resources: Network[];
}

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getAggregatedNetwork = async (
  projectId: string,
): Promise<AggregatedNetwork> => {
  const { data } = await v6.get<AggregatedNetwork>(
    `/cloud/project/${projectId}/aggregated/network`,
  );
  return data;
};

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getAggregatedPrivateNetworksQueryKey = (projectId: string) => {
  return ['aggregated-network', projectId];
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
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

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
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
