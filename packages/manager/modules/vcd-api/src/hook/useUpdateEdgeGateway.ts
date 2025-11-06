import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { updateVcdEdgeGateway } from '../api';
import {
  GetEdgeGatewayParams,
  UpdateEdgeGatewayPayload,
  VCDEdgeGateway,
} from '../types';
import { getVcdEdgeGatewayListQueryKey } from '../utils';

type UseUpdateEdgeGatewayParams = GetEdgeGatewayParams &
  Partial<
    UseMutationOptions<
      VCDEdgeGateway,
      ApiError,
      UpdateEdgeGatewayPayload,
      unknown
    >
  >;

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
