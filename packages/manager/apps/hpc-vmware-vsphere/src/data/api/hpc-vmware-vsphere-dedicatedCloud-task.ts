import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { DedicatedCloudTask } from '@/types/datacloud';

export const getDedicatedCloudServiceTaskQueryKey = (
  serviceName: string,
  datacenterId: number,
  taskId: number,
) => ['get/dedicatedCloud/task', serviceName, datacenterId, taskId];

export const getDedicatedCloudServiceTask = async (
  serviceName: string,
  taskId: number,
): Promise<ApiResponse<DedicatedCloudTask>> =>
  apiClient.v6.get<DedicatedCloudTask>(
    `/dedicatedCloud/${serviceName}/task/${taskId}`,
  );
