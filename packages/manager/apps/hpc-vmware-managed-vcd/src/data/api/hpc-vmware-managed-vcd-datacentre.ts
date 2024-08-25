import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import IVcdDatacentre, {
  IVcdDatacentreState,
} from '@/types/vcd-datacenter.interface';

export type UpdateVdcDetailsParams = {
  id: string;
  vdcId: string;
  details: IVcdDatacentreState;
};

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

export const updateVdcDetails = async ({
  id,
  vdcId,
  details,
}: UpdateVdcDetailsParams) =>
  apiClient.v2.put(
    `/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
    { targetSpec: details },
  );
