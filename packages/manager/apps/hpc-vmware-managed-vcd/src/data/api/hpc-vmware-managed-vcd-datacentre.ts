import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import IVcdDatacentre, {
  IVcdDatacentreState,
} from '@/types/vcd-datacenter.interface';
import { VCD_ORGANIZATION_ROUTE } from './hpc-vmware-managed-vcd.constants';
import { IVdcOrderableResource } from '@/types/vcd-vdc-orderable-resource.interface';

export type UpdateVdcDetailsParams = {
  id: string;
  vdcId: string;
  details: IVcdDatacentreState;
};

export const getVcdDatacentresRoute = (id: string) => {
  return `${VCD_ORGANIZATION_ROUTE}/${id}/virtualDataCenter`;
};

export const getVcdDatacentreRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentresRoute(id)}/${vdcId}`;
};

export const getVcdDatacentreComputeRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/compute`;
};

export const getVcdDatacentreStorageRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/storage`;
};

export const getVdcOrderableResourceRoute = (id: string, vdcId: string) => {
  return `${getVcdDatacentreRoute(id, vdcId)}/orderableResource`;
};

export const getVcdDatacentre = async (
  id: string,
  vdcId: string,
): Promise<ApiResponse<IVcdDatacentre>> =>
  apiClient.v2.get(getVcdDatacentreRoute(id, vdcId));

export const getVcdDatacentres = async (
  id: string,
): Promise<ApiResponse<IVcdDatacentre[]>> =>
  apiClient.v2.get(getVcdDatacentresRoute(id));

export const updateVdcDetails = async ({
  id,
  vdcId,
  details,
}: UpdateVdcDetailsParams) =>
  apiClient.v2.put(getVcdDatacentreRoute(id, vdcId), {
    targetSpec: details,
  });

export const getVdcOrderableResource = async (
  id: string,
  vdcId: string,
): Promise<ApiResponse<IVdcOrderableResource>> =>
  apiClient.v2.get(getVdcOrderableResourceRoute(id, vdcId));
