import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  getIpGameFirewall,
  getIpGameFirewallQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export type UseGetIpGameFirewallParams = {
  ip: string;
  ipOnGame: string;
  enabled?: boolean;
  refetchInterval?: number;
};

// get ip game firewall infos for
export const useGetIpGameFirewall = ({
  ip,
  ipOnGame,
  enabled = true,
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
}: UseGetIpGameFirewallParams) => {
  const getQuery = useQuery<ApiResponse<IpGameFirewallType>, ApiError>({
    queryKey: getIpGameFirewallQueryKey({ ip, ipOnGame }),
    queryFn: async () => getIpGameFirewall({ ip, ipOnGame }),
    enabled,
    retry: false,
    refetchInterval: (query) =>
      // Array can be empty and will trigger the refresh indefinitly
      query.state.data?.data?.state &&
      query.state.data?.data?.state !== IpGameFirewallStateEnum.OK
        ? refetchInterval
        : undefined,
  });

  return {
    ipGameFirewall: getQuery?.data?.data,
    ...getQuery,
  };
};
