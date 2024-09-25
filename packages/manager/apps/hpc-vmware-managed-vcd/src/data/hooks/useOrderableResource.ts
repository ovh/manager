import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { IVdcOrderableResourceData } from '@/types/vcd-vdc-orderable-resource.interface';
import { getVdcOrderableResource } from '../api/hpc-vmware-managed-vcd-datacentre';
import { getVcdDatacentreQueryKey } from './useManagedVcdDatacentres';

const getVdcOrderableResourceQueryKey = (id: string, vdcId: string) => [
  `${getVcdDatacentreQueryKey(id, vdcId)}/orderableResource`,
];

export const useVdcOrderableResource = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<IVdcOrderableResourceData>, ApiError>({
    queryKey: getVdcOrderableResourceQueryKey(id, vdcId),
    queryFn: () => getVdcOrderableResource(id, vdcId),
    placeholderData: keepPreviousData,
  });
};
