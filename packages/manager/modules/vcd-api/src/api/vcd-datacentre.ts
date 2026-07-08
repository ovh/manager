import { ApiResponse, apiClient, v2 } from '@ovh-ux/manager-core-api';
import {
  GetDatacentreComputeParams,
  GetDatacentreStorageParams,
  VCDCompute,
  VCDDatacentre,
  VCDDatacentreTargetSpec,
  VCDOrderableResourceData,
  VCDStorage,
} from '../types';
import {
  getVcdDatacentreComputeListRoute,
  getVcdDatacentreComputeRoute,
  getVcdDatacentreRoute,
  getVcdDatacentresRoute,
  getVcdDatacentreStorageListRoute,
  getVcdDatacentreStorageRoute,
  getVdcOrderableResourceRoute,
} from '../utils/apiRoutes';

export type UpdateVdcDetailsParams = {
  id: string;
  vdcId: string;
  details: VCDDatacentreTargetSpec;
};

export const getVcdDatacentre = async (
  id: string,
  vdcId: string,
): Promise<ApiResponse<VCDDatacentre>> =>
  apiClient.v2.get(getVcdDatacentreRoute(id, vdcId));

export const getVcdDatacentres = async (
  id: string,
): Promise<ApiResponse<VCDDatacentre[]>> =>
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
): Promise<ApiResponse<VCDOrderableResourceData>> =>
  apiClient.v2.get(getVdcOrderableResourceRoute(id, vdcId));

export const getVcdDatacentreCompute = async (
  id: string,
  vdcId: string,
): Promise<VCDCompute[]> => {
  const { data } = await v2.get(getVcdDatacentreComputeListRoute(id, vdcId));
  return data;
};

export const deleteVcdDatacentreCompute = async (
  params: GetDatacentreComputeParams,
): Promise<VCDCompute> => {
  const { data } = await v2.delete(getVcdDatacentreComputeRoute(params));
  return data;
};

export const getVcdDatacentreStorage = async (
  id: string,
  vdcId: string,
): Promise<VCDStorage[]> => {
  const { data } = await v2.get(getVcdDatacentreStorageListRoute(id, vdcId));
  return data;
};

export const deleteVcdDatacentreStorage = async (
  params: GetDatacentreStorageParams,
): Promise<VCDStorage> => {
  const { data } = await v2.delete(getVcdDatacentreStorageRoute(params));
  return data;
};
