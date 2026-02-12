import { useMutation, useQueries, useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  AggregateResponse,
  SliceResponse,
  getAggregate,
  getSlice,
  postAggregate,
  postSlice,
} from '@/data/api';
import { IpTask } from '@/types';
import { useGetIpDetailsList } from './useGetIpDetails';

export function getAggregateQueryKey(ip: string) {
  return [`get/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`];
}

export function useByoipAggregate({
  ip,
  onSuccess,
  onError,
}: {
  ip: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) {
  const { isLoading, error, data } = useQuery<
    ApiResponse<AggregateResponse>,
    ApiError
  >({
    queryKey: getAggregateQueryKey(ip),
    queryFn: () => getAggregate(ip),
    enabled: !!ip,
    retry: false,
  });

  const { mutate, isPending, error: aggregateError } = useMutation<
    ApiResponse<IpTask>,
    ApiError,
    { aggregationIp: string }
  >({
    mutationFn: ({ aggregationIp }) => postAggregate({ ip, aggregationIp }),
    onSuccess,
    onError,
  });

  return {
    aggregate: data?.data ?? [],
    loading: isLoading,
    error,
    postAggregate: mutate,
    isAggregatePending: isPending,
    aggregateError,
  };
}

export function getSliceQueryKey(ip: string) {
  return [`get/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`];
}

export function useByoipSlice({
  ip,
  onSuccess,
  onError,
  enabled = true,
}: {
  ip: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  enabled?: boolean;
}) {
  const { isLoading, error, data } = useQuery<
    ApiResponse<SliceResponse>,
    ApiError
  >({
    queryKey: getSliceQueryKey(ip),
    queryFn: () => getSlice(ip),
    enabled: !!ip && enabled,
    retry: false,
  });

  const { mutate, isPending, error: slicingError } = useMutation<
    ApiResponse<IpTask>,
    ApiError,
    { slicingSize: number }
  >({
    mutationFn: ({ slicingSize }) => postSlice({ ip, slicingSize }),
    onSuccess,
    onError,
  });

  return {
    slice: data?.data ?? [],
    loading: isLoading,
    error,
    postSlice: mutate,
    isSlicePending: isPending,
    slicingError,
  };
}

export const useByoipSliceList = ({
  ipList,
  isEnabled,
}: {
  ipList: string[];
  isEnabled?: (ip?: string) => boolean;
}): {
  isLoading: boolean;
  isError: boolean;
  sliceListByIp: { [ip: string]: SliceResponse };
} => {
  const { detailsByIp, isLoading, isError } = useGetIpDetailsList({ ipList });

  const queries = (ipList || []).map((ip) => ({
    queryKey: getSliceQueryKey(ip),
    queryFn: async () => {
      const result = await getSlice(ip);
      return {
        ...result,
        data: { ip, sliceList: result.data },
      };
    },
    enabled:
      !isLoading &&
      !isError &&
      detailsByIp?.[ip]?.bringYourOwnIp &&
      (isEnabled ? isEnabled(ip) : true),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  }));

  const results = useQueries({ queries });

  return {
    isLoading: isLoading || results.some((result) => result.isLoading),
    isError: isError || results.some((result) => result.isError),
    sliceListByIp: results.reduce((acc, result) => {
      if (result.data) {
        acc[result.data.data.ip] = result.data.data.sliceList;
      }
      return acc;
    }, {} as { [ip: string]: SliceResponse }),
  };
};
