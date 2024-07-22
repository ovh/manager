import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import {
  getVcdDatacentre,
  getVcdDatacentreQueryKey,
  getVcdDatacentres,
  getVcdDatacentresQueryKey,
  TGetVcdDatacentreParams,
} from '../api/hpc-vmware-managed-vcd-datacentre';
import IVcdDatacentre from '@/types/vcd-datacenter.interface';

const useManagedVcdDatacentres = (id: string) => {
  return useQuery<ApiResponse<IVcdDatacentre[]>, ApiError>({
    queryKey: getVcdDatacentresQueryKey({ id }),
    queryFn: () => getVcdDatacentres({ id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useManagedVcdDatacentre = ({
  id,
  vdcId,
}: TGetVcdDatacentreParams) => {
  return useQuery<ApiResponse<IVcdDatacentre>, ApiError>({
    queryKey: getVcdDatacentreQueryKey({ id, vdcId }),
    queryFn: () => getVcdDatacentre({ id, vdcId }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export default useManagedVcdDatacentres;
