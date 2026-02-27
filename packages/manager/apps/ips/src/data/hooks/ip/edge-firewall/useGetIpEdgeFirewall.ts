import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { AxiosHeaders } from 'axios';
import {
  IpEdgeFirewallStateEnum,
  IpEdgeFirewallType,
  getIpEdgeFirewall,
  getIpEdgeFirewallQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export type UseGetIpEdgeFirewallParams = {
  ip: string;
  ipOnFirewall: string;
  enabled?: boolean;
  refetchInterval?: number;
};

export const useGetIpEdgeFirewall = ({
  ip,
  ipOnFirewall,
  enabled = true,
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
}: UseGetIpEdgeFirewallParams) => {
  const {
    data: ipEdgeFirewallResponse,
    isLoading: loading,
    isError,
    error,
  } = useQuery<ApiResponse<IpEdgeFirewallType>, ApiError>({
    queryKey: getIpEdgeFirewallQueryKey({ ip, ipOnFirewall }),
    queryFn: async () => {
      try {
        const firewall = await getIpEdgeFirewall({ ip, ipOnFirewall });
        return firewall;
      } catch (err) {
        if ((err as ApiError).status === 404) {
          return {
            data: null as IpEdgeFirewallType | null,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { headers: {} as AxiosHeaders },
          } as ApiResponse<IpEdgeFirewallType>;
        }
        throw err;
      }
    },
    enabled,
    retry: false,
    refetchInterval: (query) =>
      query.state.error ||
      !query.state.data?.data?.state ||
      query.state.data?.data?.state === IpEdgeFirewallStateEnum.OK
        ? undefined
        : refetchInterval,
  });

  return {
    ipEdgeFirewall: ipEdgeFirewallResponse?.data,
    loading,
    isError,
    error,
  };
};
