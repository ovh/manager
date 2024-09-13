import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getVcdDatacentre,
  getVcdDatacentres,
  getVdcOrderableResource,
} from '../api/hpc-vmware-managed-vcd-datacentre';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import { IVdcOrderableResource } from '@/types/vcd-vdc-orderable-resource.interface';

export const getVcdDatacentresQueryKey = (id: string) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter`,
];
const getVcdDatacentreQueryKey = (id: string, vdcId: string) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
];
const getVdcOrderableResourceQueryKey = (id: string, vdcId: string) => [
  `${getVcdDatacentreQueryKey(id, vdcId)}/orderableResource`,
];

const useManagedVcdDatacentres = (id: string) => {
  return useQuery<ApiResponse<IVcdDatacentre[]>, ApiError>({
    queryKey: getVcdDatacentresQueryKey(id),
    queryFn: () => getVcdDatacentres(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useManagedVcdDatacentre = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<IVcdDatacentre>, ApiError>({
    queryKey: getVcdDatacentreQueryKey(id, vdcId),
    queryFn: () => getVcdDatacentre(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useVdcOrderableResource = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<IVdcOrderableResource>, ApiError>({
    queryKey: getVdcOrderableResourceQueryKey(id, vdcId),
    queryFn: () => getVdcOrderableResource(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdDatacentres;
