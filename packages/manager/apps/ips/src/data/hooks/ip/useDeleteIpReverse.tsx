import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import ipaddr from 'ipaddr.js';
import { deleteIpReverse, getIpReverseQueryKey } from '@/data/api';

export type UseDeleteIpReverseParams = {
  ipGroup?: string;
  ip: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<null>) => void;
};

export const useDeleteIpReverse = ({
  ip,
  ipGroup,
  onError,
  onSuccess,
}: UseDeleteIpReverseParams) => {
  const group = ipGroup || `${ip}/${ipaddr.IPv4.isIPv4(ip) ? 32 : 128}`;
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => deleteIpReverse({ ipGroup: group, ip }),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpReverseQueryKey({ ip: group }),
      });
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
