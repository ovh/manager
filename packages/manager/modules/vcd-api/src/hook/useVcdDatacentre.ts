import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { VCDDatacentre } from '../types';
import {
  getVcdDatacentreQueryKey,
  getVcdDatacentreListQueryKey,
} from '../utils';
import { getVcdDatacentre, getVcdDatacentres } from '../api';

export const useVcdDatacentres = (id: string) => {
  return useQuery<ApiResponse<VCDDatacentre[]>, ApiError>({
    queryKey: getVcdDatacentreListQueryKey(id),
    queryFn: () => getVcdDatacentres(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useVcdDatacentre = (id: string, vdcId: string) => {
  return useQuery<ApiResponse<VCDDatacentre>, ApiError>({
    queryKey: getVcdDatacentreQueryKey(id, vdcId),
    queryFn: () => getVcdDatacentre(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};
