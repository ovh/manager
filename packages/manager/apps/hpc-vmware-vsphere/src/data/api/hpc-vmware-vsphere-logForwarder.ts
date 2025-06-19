import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { LogForwarder } from '@/types/logForwarder';

export const postDedicatedCloudServiceLogForwarderEnableQueryKey = (
  serviceName: string,
) => ['post/dedicatedCloud/logForwarder/enable', serviceName];

export const postDedicatedCloudServiceLogForwarderEnable = async (
  serviceName: string,
): Promise<ApiResponse<LogForwarder>> =>
  apiClient.v6.post<LogForwarder>(
    `/dedicatedCloud/${serviceName}/logForwarder/enable`,
  );
