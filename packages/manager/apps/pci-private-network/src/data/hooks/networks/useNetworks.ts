import { useQuery, useMutation } from '@tanstack/react-query';
import {
  checkPrivateNetworkCreationStatus,
  getPrivateNetworks,
  getSubnets,
} from '@/data/api/networks';
import { CreationStatus } from '@/types/network.type';

export const useGetPrivateNetworks = (projectId: string) =>
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

export const useGetSubnets = (
  projectId: string,
  networkId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['subnets', projectId, networkId, region],
    queryFn: () => getSubnets(projectId, region, networkId),
    enabled: !!(projectId && networkId && region),
  });
