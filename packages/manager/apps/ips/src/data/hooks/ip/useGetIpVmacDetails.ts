import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  DedicatedServerVmacDetailsType,
  getDedicatedServerVmacDetails,
  getDedicatedServerVmacDetailsQueryKey,
} from '@/data/api';

export type UseGetIpVmacDetailsParams = {
  ip: string;
  serviceName?: string | null;
  macAddress?: string;
  enabled?: boolean;
};

export const useGetIpVmacDetails = ({
  serviceName,
  macAddress,
  ip,
  enabled = true,
}: UseGetIpVmacDetailsParams) => {
  const { data, isLoading: loading, isError } = useQuery<
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
    enabled: Boolean(serviceName) && Boolean(macAddress) && enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { dedicatedServerVmacWithIpResponse: data?.data, loading, isError };
};
