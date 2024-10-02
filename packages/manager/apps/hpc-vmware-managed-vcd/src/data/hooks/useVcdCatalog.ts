import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdCatalog } from '../api/hpc-vmware-managed-vcd-cart';
import { TVcdCatalog } from '@/types/vcd-catalog.interface';

const getVcdCatalogQueryKey = (serviceName: string) => [
  `get/order/cartServiceOption/vmwareCloudDirector/${serviceName}`,
];

export const useVcdCatalog = (serviceName: string) => {
  return useQuery<ApiResponse<TVcdCatalog>, ApiError>({
    queryKey: getVcdCatalogQueryKey(serviceName),
    queryFn: () => getVcdCatalog(serviceName),
    placeholderData: keepPreviousData,
  });
};
