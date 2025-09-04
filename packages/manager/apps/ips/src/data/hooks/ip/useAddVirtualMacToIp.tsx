import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getdedicatedServerVmacQueryKey, addVirtualMacToIp } from '@/data/api';

export type UseAddVirtualMacToIpParams = {
  serviceName: string;
  ip: string;
  type: string;
  virtualMachineName: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<void>) => void;
};

export const useAddVirtualMacToIp = (params: UseAddVirtualMacToIpParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => addVirtualMacToIp(params),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getdedicatedServerVmacQueryKey({
          serviceName: params.serviceName,
        }),
      });
      params.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      params.onError?.(error);
    },
  });
};
