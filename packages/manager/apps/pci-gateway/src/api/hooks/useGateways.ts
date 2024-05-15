import { useMutation, useQuery } from '@tanstack/react-query';
import queryClient from '@ovh-ux/manager-pci-users-app/src/queryClient';
import { getGateway, getGatewayUrl, updateGateway } from '@/api/data/gateways';

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
    mutationFn: ({ name, model }: { name: string; model: string }) => {
      return updateGateway(projectId, regionName, gatewayId, name, model);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [getGatewayUrl(projectId, regionName, gatewayId)],
      });
      onSuccess();
    },
  });

  return {
    updateGateway: ({ name, model }: { name: string; model: string }) => {
      return mutation.mutate({ name, model });
    },
    ...mutation,
  };
};
