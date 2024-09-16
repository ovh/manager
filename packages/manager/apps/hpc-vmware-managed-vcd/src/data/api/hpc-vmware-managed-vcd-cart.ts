import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';

export const getVcdCartServiceOption = async (
  serviceName: string,
): Promise<ApiResponse<unknown>> =>
  apiClient.v2.get(
    `/order/cartServiceOption/vmwareCloudDirector/${serviceName}`,
  );
