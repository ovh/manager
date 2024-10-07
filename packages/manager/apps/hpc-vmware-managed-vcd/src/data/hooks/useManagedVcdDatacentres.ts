import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getVcdDatacentre,
  getVcdDatacentres,
} from '../api/hpc-vmware-managed-vcd-datacentre';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import {
  getVcdDatacentresQueryKey,
  getVcdDatacentreQueryKey,
} from '@/utils/getQueryKeys';

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

export default useManagedVcdDatacentres;
