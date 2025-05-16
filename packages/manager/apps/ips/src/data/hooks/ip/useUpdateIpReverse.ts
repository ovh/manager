import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import ipaddr from 'ipaddr.js';
import {
  IpReverseResponseType,
  getIpReverseQueryKey,
  updateIpReverse,
} from '@/data/api';

export type UseUpdateIpReverseParams = {
  ipGroup?: string;
  ip: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<IpReverseResponseType>) => void;
};

export const useUpdateIpReverse = ({
  ip,
  ipGroup,
  onError,
  onSuccess,
}: UseUpdateIpReverseParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();
  const group = ipGroup || `${ip}/${ipaddr.IPv4.isIPv4(ip) ? 32 : 128}`;

  return useMutation({
    mutationFn: ({ reverse }: { reverse: string }) =>
      updateIpReverse({ ipGroup: group, ip, reverse }),
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
