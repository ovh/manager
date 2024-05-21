import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createNetworkWithGateway,
  getNetworks,
  getNetworksUrl,
  getPrivateNetworks,
  TNewNetworkWithGateway,
} from '@/api/data/networks';

export type TCreateNetworkWithGatewayParam = {
  projectId: string;
  regionName: string;
  onError: (error: string) => void;
  onSuccess: () => void;
};

export const getNetworksQuery = (projectId: string, regionName: string) => ({
  queryKey: [getNetworksUrl(projectId, regionName)],
  queryFn: () => getNetworks(projectId, regionName),
});

export const getPrivateNetworksQuery = (
  projectId: string,
  regionName: string,
) => ({
  queryKey: [getNetworksUrl(projectId, regionName), 'private'],
  queryFn: () => getPrivateNetworks(projectId, regionName),
});

export const useNetworks = (projectId: string, regionName: string) =>
  useQuery({
    ...getNetworksQuery(projectId, regionName),
    enabled: !!projectId && !!regionName,
  });

export const usePrivateNetworks = (projectId: string, regionName: string) =>
  useQuery({
    ...getPrivateNetworksQuery(projectId, regionName),
    enabled: !!projectId && !!regionName,
  });

export const useCreateNetworkWithGateway = ({
  projectId,
  regionName,
  onError,
  onSuccess,
}: TCreateNetworkWithGatewayParam) => {
  const mutation = useMutation({
    mutationFn: (newNetwork: TNewNetworkWithGateway) =>
      createNetworkWithGateway(projectId, regionName, newNetwork),
    onError,
    onSuccess,
  });

  return {
    createNetworkWithGateway: (newNetwork: TNewNetworkWithGateway) =>
      mutation.mutate(newNetwork),
    ...mutation,
  };
};
