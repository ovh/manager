import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpGameFirewallType,
  getIpGameFirewall,
  getIpGameFirewallQueryKey,
} from '@/data/api';

export type UseGetIpGameFirewallParams = {
  ip: string;
  enabled?: boolean;
};

// get ip game firewall infos for
export const useGetIpGameFirewall = ({
  ip,
  enabled = true,
}: UseGetIpGameFirewallParams) => {
  const { data: ipGameFirewallResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpGameFirewallType>,
    ApiError
  >({
    queryKey: getIpGameFirewallQueryKey({ ip }),
    queryFn: () => getIpGameFirewall({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    ipGameFirewall: ipGameFirewallResponse?.data,
    isLoading,
    isError,
    error,
  };
};
