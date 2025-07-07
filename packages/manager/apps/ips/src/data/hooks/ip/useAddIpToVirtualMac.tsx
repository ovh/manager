import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getIpDetailsQueryKey, addIpToVirtualMac } from '@/data/api';

export type UseAddIpToVirtualMacParams = {
  serviceName: string;
  macAddress: string;
  ip: string;
  virtualMachineName: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<void>) => void;
};

export const useAddIpToVirtualMac = (params: UseAddIpToVirtualMacParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => addIpToVirtualMac(params),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpDetailsQueryKey({ ip: params.ip }),
      });
      params.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      params.onError?.(error);
    },
  });
};
