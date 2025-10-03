import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getBillingInfoQueryKey, getBillingInfo } from '@/data/api/billingInfo';
import { BillingInfo } from '@/data/types/billing.type';
import { DedicatedServer } from '@/data/types/server.type';
import { useGetNutanixServer } from './useGetNutanixServer';

export type UseGetBillingInfoParams = {
  server: DedicatedServer;
};

export const useGetBillingInfo = ({ server }: UseGetBillingInfoParams) => {
  const {
    nutanixServers,
    isLoading: isLoadingNunatix,
    isError,
  } = useGetNutanixServer();
  const { data: billingInfoResponse, isLoading, error } = useQuery<
    ApiResponse<BillingInfo>,
    ApiError
  >({
    queryKey: getBillingInfoQueryKey(server.name),
    queryFn: () => {
      const isNutanix = server.os.includes('nutanix'); // temproray check until manage tags
      const cluster = isNutanix && nutanixServers[server.name];
      return getBillingInfo(server.name, isNutanix, cluster);
    },
    enabled: !isLoadingNunatix,
  });

  return {
    billingInfo: billingInfoResponse?.data,
    isLoading: isLoadingNunatix && isLoading,
    isError,
    error,
  };
};
