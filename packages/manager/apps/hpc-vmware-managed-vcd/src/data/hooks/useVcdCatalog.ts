import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdCatalog } from '../api/hpc-vmware-managed-vcd-cart';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';
import { getVcdCatalogQueryKey } from '@/utils/queryKeys';

export const useVcdCatalog = (serviceName: string) => {
  return useQuery<ApiResponse<TVcdCatalog>, ApiError>({
    queryKey: getVcdCatalogQueryKey(serviceName),
    queryFn: () => getVcdCatalog(serviceName),
    placeholderData: keepPreviousData,
  });
};
