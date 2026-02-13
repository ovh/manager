import { useMutation } from '@tanstack/react-query';

import { TResizeLoadBalancerFlavorDTO } from '@/adapters/tanstack/loadBalancerFlavor/right/dto.type';
import { loadBalancerFlavorAdapter } from '@/adapters/tanstack/loadBalancerFlavor/right/loadBalancerFlavorAdapter';
import { isApiErrorResponse } from '@/data/utils';
import queryClient from '@/queryClient';

type TUseResizeLoadBalancerFlavorCallbacks = {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
};

type TUseResizeLoadBalancerFlavorParams = {
  projectId: string;
  region: string;
  loadBalancerId: string;
  callbacks?: TUseResizeLoadBalancerFlavorCallbacks;
};

export const useResizeLoadBalancerFlavor = ({
  projectId,
  region,
  loadBalancerId,
  callbacks = {},
}: TUseResizeLoadBalancerFlavorParams) => {
  const { onSuccess, onError } = callbacks;

  return useMutation({
    mutationFn: (flavor: TResizeLoadBalancerFlavorDTO) =>
      loadBalancerFlavorAdapter.resizeFlavor({
        projectId,
        region,
        loadBalancerId,
        flavor,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['loadBalancer', projectId, region, loadBalancerId],
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      const errorMessage =
        (isApiErrorResponse(error) ? error.response?.data.message : error.message) ?? '';
      onError?.(errorMessage);
    },
  });
};
