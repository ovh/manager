import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@ovh-ux/manager-pci-users-app/src/queryClient';
import {
  createGateway,
  TNewGateway,
  getGateway,
  getGatewayUrl,
  updateGateway,
} from '@/api/data/gateways';
import { TOperation } from '@/api/data/operation';

export type TCreateGatewayParam = {
  projectId: string;
  regionName: string;
  networkId: string;
  subnetId: string;
  onError: (error: string) => void;
  onSuccess: (op: TOperation) => void;
};

export const useCreateGateway = ({
  projectId,
  regionName,
  networkId,
  subnetId,
  onError,
  onSuccess,
}: TCreateGatewayParam) => {
  const mutation = useMutation({
    mutationFn: (newGateway: TNewGateway) =>
      createGateway(projectId, regionName, networkId, subnetId, newGateway),
    onError,
    onSuccess,
  });

  return {
    createGateway: (newGateway: TNewGateway) => mutation.mutate(newGateway),
    ...mutation,
  };
};

/// /////
export const getGatewayQuery = (
  projectId: string,
  regionName: string,
  gatewayId: string,
) => ({
  queryKey: [getGatewayUrl(projectId, regionName, gatewayId)],
  queryFn: () => getGateway(projectId, regionName, gatewayId),
});

export const useGateway = (
  projectId: string,
  regionName: string,
  gatewayId: string,
) =>
  useQuery({
    ...getGatewayQuery(projectId, regionName, gatewayId),
  });

export type TUpdateGatewayParam = {
  projectId: string;
  regionName: string;
  gatewayId: string;
  onError: () => void;
  onSuccess: () => void;
};

export const useEditGateway = ({
  projectId,
  regionName,
  gatewayId,
  onError,
  onSuccess,
}: TUpdateGatewayParam) => {
  const mutation = useMutation({
    mutationFn: ({ name, model }: { name: string; model: string }) =>
      updateGateway(projectId, regionName, gatewayId, name, model),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [getGatewayUrl(projectId, regionName, gatewayId)],
      });
      onSuccess();
    },
  });

  return {
    updateGateway: ({ name, model }: { name: string; model: string }) =>
      mutation.mutate({ name, model }),
    ...mutation,
  };
};
