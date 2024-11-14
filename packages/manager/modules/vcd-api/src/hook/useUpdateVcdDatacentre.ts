import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { VCDDatacentre } from '../types';
import { getVcdDatacentreQueryKey, getVcdDatacentresQueryKey } from '../utils';
import { getVcdDatacentre, getVcdDatacentres } from '../api';

const useManagedVcdDatacentres = (id: string) => {
  return useQuery<ApiResponse<VCDDatacentre[]>, ApiError>({
    queryKey: getVcdDatacentresQueryKey(id),
    queryFn: () => getVcdDatacentres(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useManagedVcdDatacentre = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<VCDDatacentre>, ApiError>({
    queryKey: getVcdDatacentreQueryKey(id, vdcId),
    queryFn: () => getVcdDatacentre(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdDatacentres;
