import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { IBillingService } from '@/types/vcd-billing.interface';
import {
  getBillingService,
  getVcdServiceIdQueryKey,
} from '../api/hpc-vmware-managed-vcd-service';

const useManagedVcdService = (id: string) => {
  return useQuery<ApiResponse<IBillingService>, ApiError>({
    queryKey: getVcdServiceIdQueryKey({ id }),
    queryFn: () => getBillingService({ id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: 5000,
  });
};

export default useManagedVcdService;
