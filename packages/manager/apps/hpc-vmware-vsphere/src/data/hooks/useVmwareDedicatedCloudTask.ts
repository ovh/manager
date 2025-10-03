import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { DedicatedCloudTask } from '@/types/datacloud';
import {
  getDedicatedCloudServiceTask,
  getDedicatedCloudServiceTaskQueryKey,
} from '../api/hpc-vmware-vsphere-dedicatedCloud-task';

export const useVmwareDedicatedCloudTask = (
  serviceName: string,
  taskId?: number,
) => {
  return useQuery<ApiResponse<DedicatedCloudTask>, ApiError>({
    queryKey: getDedicatedCloudServiceTaskQueryKey(serviceName, taskId),
    queryFn: () => getDedicatedCloudServiceTask(serviceName, taskId),
    refetchInterval: 30_000,
    enabled: !!taskId,
  });
};
