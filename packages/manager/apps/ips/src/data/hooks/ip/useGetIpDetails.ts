import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { IpDetails, getIpDetails, getIpDetailsQueryKey } from '@/data/api';

export type UseGetIpDetailsParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpdetails = ({
  ip,
  enabled = true,
}: UseGetIpDetailsParams) => {
  const {
    data: ipDetailsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<IpDetails>, ApiError>({
    queryKey: getIpDetailsQueryKey({ ip }),
    queryFn: () => getIpDetails({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { ipDetails: ipDetailsResponse?.data, isLoading, isError, error };
};
