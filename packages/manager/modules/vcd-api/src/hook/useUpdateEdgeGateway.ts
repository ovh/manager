import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVcdEdgeGateway } from '../api';
import {
  GetEdgeGatewayParams,
  RestrictedMutationOptions,
  VCDEdgeGateway,
} from '../types';
import {
  getVcdEdgeGatewayListQueryKey,
  getVcdEdgeGatewayQueryKey,
} from '../utils';

type UpdateEdgeGatewayPayload = {
  name: string;
};

type UseUpdateEdgeGatewayParams = GetEdgeGatewayParams &
  RestrictedMutationOptions<VCDEdgeGateway, UpdateEdgeGatewayPayload>;

export const useUpdateEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  onSettled,
  ...options
}: UseUpdateEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEdgeGatewayPayload) =>
      updateVcdEdgeGateway({ id, vdcId, edgeGatewayId, payload }),
    ...options,
    onSettled: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayQueryKey({ id, vdcId, edgeGatewayId }),
      });
      onSettled?.(...params);
    },
  });
};
