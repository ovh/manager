import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';

export const getVcdDatacentre = async (
  id: string,
  vdcId: string,
): Promise<ApiResponse<IVcdDatacentre>> =>
  apiClient.v2.get(
    `/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
  );

export const getVcdDatacentres = async (
  id: string,
): Promise<ApiResponse<IVcdDatacentre[]>> =>
  apiClient.v2.get(`/vmwareCloudDirector/organization/${id}/virtualDataCenter`);
