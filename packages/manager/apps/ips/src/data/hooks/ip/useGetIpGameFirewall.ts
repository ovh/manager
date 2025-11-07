import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpGameFirewallStateEnum,
  IpGameFirewallType,
  getIpGameFirewall,
  getIpGameFirewallQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export type UseGetIpGameFirewallParams = {
  ip: string;
  enabled?: boolean;
  refetchInterval?: number;
};

// get ip game firewall infos for
export const useGetIpGameFirewall = ({
  ip,
  enabled = true,
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
}: UseGetIpGameFirewallParams) => {
  const getQuery = useQuery<IcebergFetchResultV6<IpGameFirewallType>, ApiError>(
    {
      queryKey: getIpGameFirewallQueryKey({ ip }),
      queryFn: async () => {
        try {
          return await getIpGameFirewall({ ip });
        } catch (error) {
          const err = error as ApiError;
          if (err.response?.status === 404) {
            return {
              status: 200,
              totalCount: 0,
              data: [],
            };
          }
          throw error;
        }
      },
      enabled,
      retry: false,
      refetchInterval: (query) =>
        // Array can be empty and will trigger the refresh indefinitly
        query.state.data?.data?.[0]?.state &&
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
