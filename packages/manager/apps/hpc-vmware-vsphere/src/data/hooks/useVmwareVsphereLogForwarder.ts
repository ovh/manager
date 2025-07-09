import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  postDedicatedCloudServiceLogForwarderEnable,
  postDedicatedCloudServiceLogForwarderEnableQueryKey,
} from '../api/hpc-vmware-vsphere-logForwarder';
import { LogForwarder } from '@/types/logForwarder';
import { getDedicatedCloudDatacenterListQueryKey } from '../api/hpc-vmware-vsphere-datacenter';

export function useEnableLogForwarder(
  serviceName?: string,
  mutationOptions: Partial<
    UseMutationOptions<ApiResponse<LogForwarder>, ApiError, void>
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<LogForwarder>, ApiError, void>({
    mutationKey: postDedicatedCloudServiceLogForwarderEnableQueryKey(
      serviceName,
    ),
    mutationFn: () => postDedicatedCloudServiceLogForwarderEnable(serviceName),
    onSuccess: async (...params) => {
      await mutationOptions.onSuccess?.(...params);
      await queryClient.invalidateQueries({
        queryKey: getDedicatedCloudDatacenterListQueryKey,
      });
    },
    ...mutationOptions,
  });
}
