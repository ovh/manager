import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  IpReverseResponseType,
  getIpReverseQueryKey,
  updateIpReverse,
} from '@/data/api';
import { ipFormatter } from '@/utils';

export type UseUpdateIpReverseParams = {
  ip: string;
  ipReverse?: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<IpReverseResponseType>) => void;
};

export const useUpdateIpReverse = ({
  ip,
  ipReverse,
  onError,
  onSuccess,
}: UseUpdateIpReverseParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();
  const { ipGroup, ipAddress } = ipFormatter(ip);

  return useMutation({
    mutationFn: ({ reverse }: { reverse: string }) =>
      updateIpReverse({
        ip: ipGroup || ip,
        ipReverse: ipReverse || ipAddress,
        reverse,
      }),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpReverseQueryKey({
          ip: ipGroup || ip,
          ipReverse: ipReverse || ipAddress,
        }),
      });
      // Invalidate for iceberg query also
      await queryClient.invalidateQueries({
        queryKey: getIpReverseQueryKey({ ip }),
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
  });
};
