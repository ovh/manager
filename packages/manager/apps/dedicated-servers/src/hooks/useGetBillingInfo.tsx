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
  const { nutanixServers } = useGetNutanixServer();
  console.log(nutanixServers);
  const { data: billingInfoResponse, isLoading, isError, error } = useQuery<
    ApiResponse<BillingInfo>,
    ApiError
  >({
    queryKey: getBillingInfoQueryKey(server.name),
    queryFn: () => {
      const isNutanix = server.os.includes('nutanix'); // temproray check until manage tags
      const cluster = isNutanix && nutanixServers[server.name];
      console.log(isNutanix, cluster)
      return getBillingInfo(server.name, isNutanix, cluster);
    },
    enabled: !!nutanixServers,
  });

  return { billingInfo: billingInfoResponse?.data, isLoading, isError, error };
};
