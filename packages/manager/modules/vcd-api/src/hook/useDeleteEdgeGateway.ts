import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { getVcdEdgeGatewayListQueryKey } from '../utils';
import { GetEdgeGatewayParams } from '../types';
import { deleteVcdEdgeGateway } from '../api';

export const useDeleteEdgeGateway = ({
  id,
  vdcId,
  edgeGatewayId,
  onSuccess,
  ...options
}: GetEdgeGatewayParams &
  Partial<UseMutationOptions<unknown, ApiError, void, unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVcdEdgeGateway({ id, vdcId, edgeGatewayId }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdEdgeGatewayListQueryKey(id, vdcId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
