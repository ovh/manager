import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

export const getVcdCatalog = async (
  serviceName: string,
): Promise<ApiResponse<TVcdCatalog>> =>
  apiClient.v2.get(
    `/order/cartServiceOption/vmwareCloudDirector/${serviceName}`,
  );
