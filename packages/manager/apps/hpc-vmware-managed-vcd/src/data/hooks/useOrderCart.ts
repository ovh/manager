import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdCartServiceOption } from '../api/hpc-vmware-managed-vcd-cart';

const getVcdCartServiceOptionQueryKey = (serviceName: string) => [
  `get/order/cartServiceOption/vmwareCloudDirector/${serviceName}`,
];

export const useVcdCartServiceOption = (serviceName: string) => {
  return useQuery<ApiResponse<unknown>, ApiError>({
    queryKey: getVcdCartServiceOptionQueryKey(serviceName),
    queryFn: () => getVcdCartServiceOption(serviceName),
    placeholderData: keepPreviousData,
  });
};
