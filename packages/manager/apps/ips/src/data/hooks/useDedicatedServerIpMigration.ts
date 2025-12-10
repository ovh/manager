import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getOrderDedicatedServerInfo,
  getOrderDedicatedServerIpMigrationAvailableDurations,
  getOrderDedicatedServerIpMigrationDetails,
  OrderDedicatedServerIpMigrationParams,
  postOrderDedicatedServerIpMigration,
} from '../api/orderIpMigration';
import { IpMigrationOrder } from '@/types/ipMigrationOrder';

const getOrderDedicatedServerInfoQueryKey = (serviceName: string) => [
  `/order/dedicated/server/${serviceName}`,
];

export const getOrderDedicatedServerIpMigrationQueryKey = (
  params: Omit<OrderDedicatedServerIpMigrationParams, 'duration'>,
) => [
  `/order/dedicated/server/${params.serviceName}`,
  encodeURIComponent(params.ip),
  params.token,
];

export const getOrderDedicatedServerIpMigrationDetailsQueryKey = (
  params: OrderDedicatedServerIpMigrationParams,
) => [
  `/order/dedicated/server/${params.serviceName}`,
  encodeURIComponent(params.ip),
  params.token,
  params.duration,
];

/**
 * Provide the list of durations available for the IP migration
 */
export function useDedicatedServerIpMigrationAvailableDurations({
  ip,
  serviceName,
  token,
}: Partial<OrderDedicatedServerIpMigrationParams>) {
  const dedicatedServerInfoQuery = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: getOrderDedicatedServerInfoQueryKey(serviceName),
    queryFn: () => getOrderDedicatedServerInfo(serviceName),
    enabled: Boolean(serviceName),
    retry: false,
  });

  const ipMigrationQuery = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: getOrderDedicatedServerIpMigrationQueryKey({
      serviceName,
      ip,
      token,
    }),
    queryFn: () =>
      getOrderDedicatedServerIpMigrationAvailableDurations({
        serviceName,
        ip,
        token,
      }),
    enabled:
      Boolean(dedicatedServerInfoQuery?.data?.data?.includes('ipMigration')) &&
      Boolean(serviceName) &&
      Boolean(ip) &&
      Boolean(token),
    retry: false,
  });

  return {
    ...ipMigrationQuery,
    isIpMigrationAvailable:
      dedicatedServerInfoQuery?.data?.data?.includes('ipMigration') &&
      Boolean(ipMigrationQuery?.data?.data?.length),
    availableDurations: ipMigrationQuery?.data?.data,
    isLoading:
      dedicatedServerInfoQuery?.isLoading || ipMigrationQuery?.isLoading,
    error: dedicatedServerInfoQuery?.error || ipMigrationQuery?.error,
    isError: dedicatedServerInfoQuery?.isError || ipMigrationQuery?.isError,
  };
}

/**
 * Provide the list of contract terms and prices for the IP migration order
 */
export function useDedicatedServerIpMigrationDetails({
  ip,
  serviceName,
  token,
  duration,
}: OrderDedicatedServerIpMigrationParams) {
  return useQuery<
    ApiResponse<Omit<IpMigrationOrder, 'orderId' | 'url'>>,
    ApiError
  >({
    queryKey: getOrderDedicatedServerIpMigrationDetailsQueryKey({
      ip,
      serviceName,
      token,
      duration,
    }),
    queryFn: () =>
      getOrderDedicatedServerIpMigrationDetails({
        ip,
        serviceName,
        token,
        duration,
      }),
    enabled:
      Boolean(serviceName) &&
      Boolean(ip) &&
      Boolean(token) &&
      Boolean(duration),
    retry: false,
  });
}

/**
 * Provide the mutation that will create the order for the IP migration
 */
export function useOrderIpMigration({
  ip,
  serviceName,
  token,
  duration,
  ...mutationProps
}: OrderDedicatedServerIpMigrationParams & {
  onSuccess?: (result: ApiResponse<IpMigrationOrder>) => void;
  onError?: (err: ApiError) => void;
}) {
  return useMutation({
    ...mutationProps,
    mutationKey: getOrderDedicatedServerIpMigrationDetailsQueryKey({
      ip,
      duration,
      serviceName,
      token,
    }),
    mutationFn: () =>
      postOrderDedicatedServerIpMigration({ ip, duration, serviceName, token }),
  });
}
