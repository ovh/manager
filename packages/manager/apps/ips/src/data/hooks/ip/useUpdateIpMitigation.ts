import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getIpDetailsQueryKey,
  updateIpMitigation,
  UpdateIpMitigationParams,
} from '@/data/api';

export type UseUpdateIpMitigationParams = UpdateIpMitigationParams & {
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<void>) => void;
};

export const useUpdateIpMitigation = ({
  ipBlock,
  ip,
  mitigation,
  onError,
  onSuccess,
}: UseUpdateIpMitigationParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => updateIpMitigation({ ipBlock, ip, mitigation }),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpDetailsQueryKey({ ip }),
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
  });
};
