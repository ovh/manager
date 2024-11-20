import { useQuery } from '@tanstack/react-query';
import {
  checkPrivateNetworkCreationStatus,
  getPrivateNetworks,
  getSubnets,
} from '@/data/api/networks';
import { CreationStatus } from '@/types/network.type';
import queryClient from '@/queryClient';

export const usePrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: ['aggregated-network', projectId],
    queryFn: () => getPrivateNetworks(projectId),
  });

const getNetworkCompletedStatus = async (
  projectId: string,
  operationId: string,
) => {
  const data = await checkPrivateNetworkCreationStatus({
    projectId,
    operationId,
  });

  if (data.status !== 'completed') {
    throw new Error(data.status);
  }

  return data;
};

export const fetchCheckPrivateNetworkCreationStatus = (
  projectId: string,
  operationId: string,
) =>
  queryClient.fetchQuery({
    queryKey: [],
    queryFn: () => getNetworkCompletedStatus(projectId, operationId),
    retry: (_failureCount, error) =>
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
  });
