import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getIpMitigationWithoutIcebergQueryKey,
  updateIpMitigation,
  UpdateIpMitigationParams,
} from '@/data/api';
import { ipFormatter } from '@/utils';

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
  const { ipAddress, ipGroup } = ipFormatter(ip);
  return useMutation({
    mutationFn: () => updateIpMitigation({ ipBlock, ip, mitigation }),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpMitigationWithoutIcebergQueryKey({
          ipBlockip: ipGroup,
          ip: ipAddress,
        }),
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
  });
};
