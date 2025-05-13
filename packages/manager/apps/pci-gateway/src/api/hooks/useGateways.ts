import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import {
  createGateway,
  getGateway,
  getGatewayUrl,
  TNewGateway,
  updateGateway,
} from '@/api/data/gateways';
import { TOperation } from '@/api/data/operation';
import { Gateway } from '@/interface';

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
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [getGatewayUrl(projectId, regionName, gatewayId)],
      });
      queryClient.setQueryData(
        ['project', projectId, 'gateway'],
        (rows: Gateway[]) =>
          rows.map((gateway) => {
            const isChangedGateway = data.id === gateway.id;
            return {
              ...gateway,
              name: isChangedGateway ? data.name : gateway.name,
              model: isChangedGateway ? data.model : gateway.model,
            };
          }),
      );
      onSuccess();
    },
  });

  return {
    updateGateway: ({ name, model }: { name: string; model: string }) =>
      mutation.mutate({ name, model }),
    ...mutation,
  };
};
