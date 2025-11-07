import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVcdEdgeGateway } from '../api';
import {
  GetEdgeGatewayParams,
  RestrictedMutationOptions,
  UpdateEdgeGatewayPayload,
  VCDEdgeGateway,
} from '../types';
import { getVcdEdgeGatewayListQueryKey } from '../utils';

type UseUpdateEdgeGatewayParams = GetEdgeGatewayParams &
  RestrictedMutationOptions<VCDEdgeGateway, UpdateEdgeGatewayPayload>;

export const useUpdateEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  onSuccess,
  ...options
}: UseUpdateEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEdgeGatewayPayload) =>
      updateVcdEdgeGateway({ id, vdcId, edgeGatewayId, payload }),
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      onSuccess?.(...params);
    },
  });
};
