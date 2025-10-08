import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { AggregateResponse, getAggregate, postAggregate } from '@/data/api';
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
  onSuccess?: (data: ApiResponse<IpTask>) => void;
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
    data: aggregateTask,
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
    aggregateTask: aggregateTask?.data,
    aggregateError,
  };
}
