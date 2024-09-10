import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getVcdDatacentre,
  getVcdDatacentres,
} from '../api/hpc-vmware-managed-vcd-datacentre';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';

export const getVcdDatacentresQueryKey = (id: string) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter`,
];

const useManagedVcdDatacentres = (id: string) => {
  return useQuery<ApiResponse<IVcdDatacentre[]>, ApiError>({
    queryKey: getVcdDatacentresQueryKey(id),
    queryFn: () => getVcdDatacentres(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

const getVcdDatacentreQueryKey = (id: string, vdcId: string) => [
  `get/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
];

export const useManagedVcdDatacentre = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<IVcdDatacentre>, ApiError>({
    queryKey: getVcdDatacentreQueryKey(id, vdcId),
    queryFn: () => getVcdDatacentre(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdDatacentres;
