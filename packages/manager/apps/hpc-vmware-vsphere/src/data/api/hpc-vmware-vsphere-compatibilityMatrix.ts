import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { SecurityOption } from '@/types/compatibilityMatrix';

export const getDedicatedCloudServiceCompatibilityMatrixQueryKey = (
  serviceName: string,
) => ['get/dedicatedCloud/securityOptions/compatibilityMatrix', serviceName];

export const getDedicatedCloudServiceCompatibilityMatrix = async (
  serviceName: string,
): Promise<ApiResponse<SecurityOption[]>> =>
  apiClient.v6.get<SecurityOption[]>(
    `/dedicatedCloud/${serviceName}/securityOptions/compatibilityMatrix`,
  );
