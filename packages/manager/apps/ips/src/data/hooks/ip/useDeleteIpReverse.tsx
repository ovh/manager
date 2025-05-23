import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { deleteIpReverse, getIpReverseQueryKey } from '@/data/api';
import { ipFormatter } from '@/utils';

export type UseDeleteIpReverseParams = {
  ipReverse?: string;
  ip: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<null>) => void;
};

export const useDeleteIpReverse = ({
  ip,
  ipReverse,
  onError,
  onSuccess,
}: UseDeleteIpReverseParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();
  const { ipGroup, ipAddress } = ipFormatter(ip);

  return useMutation({
    mutationFn: () =>
      deleteIpReverse({ ip: ipGroup || ip, ipReverse: ipReverse || ipAddress }),
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
