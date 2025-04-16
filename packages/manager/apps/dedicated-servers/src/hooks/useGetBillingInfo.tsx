import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { getBillingInfoQueryKey, getBillingInfo } from '@/data/api/billingInfo';
import { BillingInfo } from '@/data/types/billing.type';

export type UseGetBillingInfoParams = {
  server: string;
};

export const useGetBillingInfo = ({ server }: UseGetBillingInfoParams) => {
  const { data: billingInfoResponse, isLoading, isError, error } = useQuery<
    ApiResponse<BillingInfo>,
    ApiError
  >({
    queryKey: getBillingInfoQueryKey(server),
    queryFn: () => getBillingInfo(server),
  });

  return { billingInfo: billingInfoResponse?.data, isLoading, isError, error };
};
