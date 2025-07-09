import { ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { DedicatedCloudTask } from '@/types/datacloud';
import {
  getDedicatedCloudServiceTask,
  getDedicatedCloudServiceTaskQueryKey,
} from '../api/hpc-vmware-vsphere-dedicatedCloud-task';

export const useVmwareDedicatedCloudTask = (
  serviceName: string,
  datacenterId: number,
  taskId?: number,
) => {
  return useQuery<ApiResponse<DedicatedCloudTask>>({
    queryKey: taskId
      ? getDedicatedCloudServiceTaskQueryKey(serviceName, datacenterId, taskId)
      : ['disabled-task-progress'],
    queryFn: () => getDedicatedCloudServiceTask(serviceName, taskId),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.state;
      return status && ['done', 'error', 'canceled'].includes(status)
        ? false
        : 10_000;
    },
  });
};
