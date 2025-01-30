import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpEdgeFirewallType,
  getIpEdgeFirewall,
  getIpEdgeFirewallQueryKey,
} from '@/data/api';

export type UseGetIpEdgeFirewallParams = {
  ipGroup: string;
  enabled?: boolean;
};

export const useGetIpEdgeFirewall = ({
  ipGroup,
  enabled = true,
}: UseGetIpEdgeFirewallParams) => {
  const { data: ipEdgeFirewallResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpEdgeFirewallType>,
    ApiError
  >({
    queryKey: getIpEdgeFirewallQueryKey({ ipGroup }),
    queryFn: () => getIpEdgeFirewall({ ipGroup }),
    enabled,
  });

  return {
    ipEdgeFirewall: ipEdgeFirewallResponse?.data,
    isLoading,
    isError,
    error,
  };
};
