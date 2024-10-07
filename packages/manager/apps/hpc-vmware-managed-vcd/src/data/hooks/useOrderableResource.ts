import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IVdcOrderableResourceData } from '@/types/vcd-vdc-orderable-resource.interface';
import { getVdcOrderableResource } from '../api/hpc-vmware-managed-vcd-datacentre';
import { getVdcOrderableResourceQueryKey } from '@/utils/queryKeys';

export const useVdcOrderableResource = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<IVdcOrderableResourceData>, ApiError>({
    queryKey: getVdcOrderableResourceQueryKey(vdcId),
    queryFn: () => getVdcOrderableResource(id, vdcId),
    placeholderData: keepPreviousData,
  });
};
