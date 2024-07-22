import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';

export type TGetVcdDatacentreParams = {
  id: string /* organization id */;
  vdcId?: string /* virtualDataCenter id */;
};

export const getVcdDatacentreQueryKey = ({
  id,
  vdcId,
}: TGetVcdDatacentreParams) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
];

export const getVcdDatacentre = async ({
  id,
  vdcId,
}: TGetVcdDatacentreParams): Promise<ApiResponse<IVcdDatacentre>> =>
  apiClient.v2.get(
    `/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
  );

export const getVcdDatacentresQueryKey = ({ id }: TGetVcdDatacentreParams) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter`,
];

export const getVcdDatacentres = async ({
  id,
}: TGetVcdDatacentreParams): Promise<ApiResponse<IVcdDatacentre[]>> =>
  apiClient.v2.get(`/vmwareCloudDirector/organization/${id}/virtualDataCenter`);
