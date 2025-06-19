import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  postDedicatedCloudServiceLogForwarderEnable,
  postDedicatedCloudServiceLogForwarderEnableQueryKey,
} from '../api/hpc-vmware-vsphare-logForwarder';
import { LogForwarder } from '@/types/logForwarder';
import {
  getDedicatedCloudDatacenterListQueryKey,
  getDedicatedCloudServiceDatacenterQueryKey,
} from '../api/hpc-vmware-vsphere-datacenter';

export function useEnableLogForwarder(serviceName?: string) {
  const queryClient = useQueryClient();
  const {
    mutate: enableLogsForwarder,
    isPending: updateIsPending,
  } = useMutation<ApiResponse<LogForwarder>, ApiError, void>({
    mutationKey: postDedicatedCloudServiceLogForwarderEnableQueryKey(
      serviceName,
    ),
    mutationFn: async () =>
      postDedicatedCloudServiceLogForwarderEnable(serviceName),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getDedicatedCloudDatacenterListQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getDedicatedCloudServiceDatacenterQueryKey(
          serviceName,
          data.data.datacenterId,
        ),
      });
    },
  });

  return { enableLogsForwarder, updateIsPending };
}
