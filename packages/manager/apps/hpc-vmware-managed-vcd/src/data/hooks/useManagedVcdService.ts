import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IBillingService } from '@/types/vcd-billing.interface';
import { getBillingService } from '../api/hpc-vmware-managed-vcd-service';

const getVcdServiceIdQueryKey = (id: string) => [`get/services${id}`];

const useManagedVcdService = (id: string) => {
  return useQuery<ApiResponse<IBillingService>, ApiError>({
    queryKey: getVcdServiceIdQueryKey(id),
    queryFn: () => getBillingService(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdService;
