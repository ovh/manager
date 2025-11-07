import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getVcdEdgeGatewayListQueryKey } from '../utils';
import {
  GetEdgeGatewayParams,
  RestrictedMutationOptions,
  VCDEdgeGateway,
} from '../types';
import { deleteVcdEdgeGateway } from '../api';

type UseDeleteEdgeGatewayParams = GetEdgeGatewayParams &
  RestrictedMutationOptions<VCDEdgeGateway, void>;

export const useDeleteEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  onSuccess,
  ...options
}: UseDeleteEdgeGatewayParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVcdEdgeGateway({ id, vdcId, edgeGatewayId }),
    ...options,
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      onSuccess?.(...params);
    },
  });
};
