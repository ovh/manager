import { useMutation } from '@tanstack/react-query';
import { createGateway, TNewGateway } from '@/api/data/gateways';

export type TCreateGatewayParam = {
  projectId: string;
  regionName: string;
  networkId: string;
  subnetId: string;
  onError: (error: string) => void;
  onSuccess: () => void;
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
    mutationFn: (newGateway: TNewGateway) => {
      return createGateway(
        projectId,
        regionName,
        networkId,
        subnetId,
        newGateway,
      );
    },
    onError,
    onSuccess,
  });

  return {
    createGateway: (newGateway: TNewGateway) => {
      return mutation.mutate(newGateway);
    },
    ...mutation,
  };
};
