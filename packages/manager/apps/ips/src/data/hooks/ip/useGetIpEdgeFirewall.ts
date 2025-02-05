import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpEdgeFirewallType,
  getIpEdgeFirewall,
  getIpEdgeFirewallQueryKey,
} from '@/data/api';

export type UseGetIpEdgeFirewallParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpEdgeFirewall = ({
  ip,
  enabled = true,
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
  });

  return {
    ipEdgeFirewall: ipEdgeFirewallResponse?.data,
    isLoading,
    isError,
    error,
  };
};
