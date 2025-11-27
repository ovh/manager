import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVcdEdgeGateway } from '../api';
import {
  GetVCDDatacentreParams,
  RestrictedMutationOptions,
  VCDEdgeGateway,
  VCDEdgeGatewayState,
} from '../types';
import { getVcdEdgeGatewayListQueryKey } from '../utils';

type UseAddEdgeGatewayParams = GetVCDDatacentreParams &
  RestrictedMutationOptions<VCDEdgeGateway, VCDEdgeGatewayState>;

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
