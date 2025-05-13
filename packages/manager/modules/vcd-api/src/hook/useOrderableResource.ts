import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { VCDOrderableResourceData } from '../types';
import { getVdcOrderableResourceQueryKey } from '../utils';
import { getVdcOrderableResource } from '../api';

export const useVdcOrderableResource = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<VCDOrderableResourceData>, ApiError>({
    queryKey: getVdcOrderableResourceQueryKey(vdcId),
    queryFn: () => getVdcOrderableResource(id, vdcId),
    placeholderData: keepPreviousData,
  });
};
