import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { createVcdEdgeGateway } from '../api';
import { VCDEdgeGateway, VCDEdgeGatewayState } from '../types';
import { getVcdEdgeGatewayListQueryKey } from '../utils';

type UseAddEdgeGatewayParams = Partial<
  UseMutationOptions<VCDEdgeGateway, ApiError, VCDEdgeGatewayState, unknown>
> & {
  id: string;
  vdcId: string;
};

export const useAddEdgeGateway = ({
  id,
  vdcId,
  onSuccess,
  ...options
}: UseAddEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VCDEdgeGatewayState) =>
      createVcdEdgeGateway({ id, vdcId, payload }),
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      onSuccess?.(...params);
    },
  });
};
