import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  getIpGameFirewall,
  getIpGameFirewallQueryKey,
} from '@/data/api';

export type UseGetIpGameFirewallParams = {
  ip: string;
  enabled?: boolean;
  refetchInterval?: number;
};

// get ip game firewall infos for
export const useGetIpGameFirewall = ({
  ip,
  enabled = true,
  refetchInterval = 2000,
}: UseGetIpGameFirewallParams) => {
  const getQuery = useQuery<IcebergFetchResultV6<IpGameFirewallType>, ApiError>(
    {
      queryKey: getIpGameFirewallQueryKey({ ip }),
      queryFn: () => getIpGameFirewall({ ip }),
      enabled,
      staleTime: Number.POSITIVE_INFINITY,
      retry: false,
      refetchInterval: (query) =>
        query.state.data?.data?.[0]?.state !== IpGameFirewallStateEnum.OK
          ? refetchInterval
          : undefined,
    },
  );

  return {
    ipGameFirewall: getQuery?.data?.data,
    ...getQuery,
  };
};
