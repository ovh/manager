import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VCDCatalog } from '../types';
import { getVcdCatalogQueryKey } from '../utils';
import { getVcdCatalog } from '../api';

export const useVcdCatalog = (serviceName: string) => {
  return useQuery<ApiResponse<VCDCatalog>, ApiError>({
    queryKey: getVcdCatalogQueryKey(serviceName),
    queryFn: () => getVcdCatalog(serviceName),
    placeholderData: keepPreviousData,
  });
};
