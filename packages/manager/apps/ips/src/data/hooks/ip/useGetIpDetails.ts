import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { IpDetails, getIpDetailsQueryKey, getIpdetails } from '@/data/api';

export type UseGetIpDetailsParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpdetails = ({
  ip,
  enabled = true,
}: UseGetIpDetailsParams) => {
  const { data: ipDetailsResponse, isLoading, isError, error } = useQuery<
    ApiResponse<IpDetails>,
    ApiError
  >({
    queryKey: getIpDetailsQueryKey({ ip }),
    queryFn: () => getIpdetails({ ip }),
    enabled,
  });

  return { ipDetails: ipDetailsResponse?.data, isLoading, isError, error };
};
