import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  DedicatedServerVmacDetailsType,
  getDedicatedServerVmacDetails,
  getDedicatedServerVmacDetailsQueryKey,
} from '@/data/api';

export type UseGetIpVmacDetailsParams = {
  serviceName: string;
  macAddress: string;
  ip: string;
  enabled?: boolean;
};

export const useGetIpVmacDetails = ({
  serviceName,
  macAddress,
  ip,
  enabled,
}: UseGetIpVmacDetailsParams) => {
  const { data, isLoading, isError } = useQuery<
    ApiResponse<DedicatedServerVmacDetailsType>,
    ApiError
  >({
    queryKey: getDedicatedServerVmacDetailsQueryKey({
      serviceName,
      macAddress,
      ip,
    }),
    queryFn: () =>
      getDedicatedServerVmacDetails({
        serviceName,
        macAddress,
        ip,
      }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { dedicatedServerVmacWithIpResponse: data?.data, isLoading, isError };
};
