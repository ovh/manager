import { useMutation, useQuery } from '@tanstack/react-query';

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

  const {
    mutate,
    isPending,
    error: aggregateError,
  } = useMutation<ApiResponse<IpTask>, ApiError, { aggregationIp: string }>({
    mutationFn: ({ aggregationIp }) => postAggregate({ ip, aggregationIp }),
    onSuccess,
    onError,
  });

  return {
    aggregate: data?.data ?? [],
    isLoading,
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

  const {
    mutate,
    isPending,
    error: slicingError,
  } = useMutation<ApiResponse<IpTask>, ApiError, { slicingSize: number }>({
    mutationFn: ({ slicingSize }) => postSlice({ ip, slicingSize }),
    onSuccess,
    onError,
  });

  return {
    slice: data?.data ?? [],
    isLoading,
    error,
    postSlice: mutate,
    isSlicePending: isPending,
    slicingError,
  };
}
