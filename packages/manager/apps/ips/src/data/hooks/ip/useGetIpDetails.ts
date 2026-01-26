import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';

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
  const { data: ipDetailsResponse, isLoading, isError, error } = useQuery<
    ApiResponse<IpDetails>,
    ApiError
  >({
    queryKey: getIpDetailsQueryKey({ ip }),
    queryFn: () => getIpDetails({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    ipDetails: ipDetailsResponse?.data,
    loading: isLoading,
    isError,
    error,
  };
};

export const useGetIpDetailsList = ({
  ipList,
  isEnabled,
}: {
  ipList: string[];
  isEnabled?: (ip?: string) => boolean;
}): {
  queries: UseQueryResult<ApiResponse<IpDetails>, ApiError>[];
  detailsByIp: { [ip: string]: IpDetails };
  isLoading: boolean;
  isError: boolean;
} => {
  const queries = (ipList || []).map((ip) => ({
    queryKey: getIpDetailsQueryKey({ ip }),
    queryFn: () => getIpDetails({ ip }),
    enabled: isEnabled ? isEnabled(ip) : true,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  }));

  const results = useQueries({ queries });

  return {
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    detailsByIp: results.reduce((acc, result) => {
      if (result.data) {
        acc[result.data.data.ip] = result.data.data;
      }
      return acc;
    }, {} as { [ip: string]: IpDetails }),
    queries: results as UseQueryResult<ApiResponse<IpDetails>, ApiError>[]
  };
};
