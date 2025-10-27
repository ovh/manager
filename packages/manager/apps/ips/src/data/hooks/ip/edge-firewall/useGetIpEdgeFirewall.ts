import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpEdgeFirewallType,
  getIpEdgeFirewall,
  getIpEdgeFirewallQueryKey,
  IpEdgeFirewallStateEnum,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export type UseGetIpEdgeFirewallParams = {
  ip: string;
  enabled?: boolean;
  refetchInterval?: number;
};

export const useGetIpEdgeFirewall = ({
  ip,
  enabled = true,
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
}: UseGetIpEdgeFirewallParams) => {
  const { data: ipEdgeFirewallResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpEdgeFirewallType>,
    ApiError
  >({
    queryKey: getIpEdgeFirewallQueryKey({ ip }),
    queryFn: () => getIpEdgeFirewall({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
    refetchInterval: (query) => {
      return query.state.error ||
        !query.state.data?.data?.[0]?.state ||
        query.state.data?.data?.[0]?.state === IpEdgeFirewallStateEnum.OK
        ? undefined
        : refetchInterval;
    },
  });

  return {
    ipEdgeFirewall: ipEdgeFirewallResponse?.data,
    isLoading,
    isError,
    error,
  };
};
