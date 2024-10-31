import { useQuery, useMutation } from '@tanstack/react-query';
import {
  checkPrivateNetworkCreationStatus,
  getPrivateNetworks,
  getSubnets,
} from '@/data/api/networks';
import { CreationStatus, TSubnet } from '@/types/network.type';

export const usePrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: ['aggregated-network', projectId],
    queryFn: () => getPrivateNetworks(projectId),
  });

export const useCheckPrivateNetworkCreationStatus = () =>
  useMutation({
    mutationFn: checkPrivateNetworkCreationStatus,
    retry: (failureCount, error) =>
      ![CreationStatus.completed, CreationStatus.inError].includes(
        error.message as CreationStatus,
      ),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

export const useSubnets = (
  projectId: string,
  networkId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['subnets', projectId, networkId, region],
    queryFn: () => getSubnets(projectId, region, networkId),
    enabled: !!(projectId && networkId && region),
    select: (subnets: TSubnet[]) =>
      subnets.map((subnet) => {
        const allocatedIp = subnet?.allocationPools
          ?.map((i) => `${i.start} - ${i.end}`)
          .join(' ,');

        return {
          ...subnet,
          region,
          allocatedIp,
          search: `${subnet.name} ${region} ${subnet.ipVersion} ${subnet.cidr} ${region} ${allocatedIp}`,
        };
      }),
  });
