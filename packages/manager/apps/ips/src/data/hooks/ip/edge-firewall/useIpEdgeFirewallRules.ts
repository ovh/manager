import {
  UseQueryOptions,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  IpEdgeFirewallRule,
  IpEdgeFirewallRuleState,
  getIpEdgeNetworkFirewallRuleDetails,
  getIpEdgeNetworkFirewallRuleDetailsQueryKey,
  getIpEdgeNetworkFirewallRuleList,
  getIpEdgeNetworkFirewallRuleListQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export const useIpEdgeNetworkFirewallRules = ({
  ip,
  ipOnFirewall,
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
}: {
  ip?: string;
  ipOnFirewall?: string;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();
  const ruleListQuery = useQuery<ApiResponse<number[]>, ApiError>({
    queryKey: getIpEdgeNetworkFirewallRuleListQueryKey({ ip, ipOnFirewall }),
    queryFn: async () => {
      try {
        const result = await getIpEdgeNetworkFirewallRuleList({
          ip,
          ipOnFirewall,
        });
        return result;
      } catch (err) {
        if ((err as ApiError).status === 404) {
          return {
            data: [] as number[],
          } as ApiResponse<number[]>;
        }
        throw err;
      }
    },
    enabled: !!ip && !!ipOnFirewall,
    retry: false,
  });

  return useQueries({
    queries: (ruleListQuery?.data?.data || []).map(
      (
        sequence,
      ): UseQueryOptions<ApiResponse<IpEdgeFirewallRule>, ApiError> => {
        const ruleParams = { ip, ipOnFirewall, sequence };
        return {
          queryKey: getIpEdgeNetworkFirewallRuleDetailsQueryKey(ruleParams),
          queryFn: () => getIpEdgeNetworkFirewallRuleDetails(ruleParams),
          enabled: !!ip && !!ipOnFirewall,
          retry: false,
          refetchInterval: (query) => {
            if (query.state.error) {
              queryClient.setQueryData(
                getIpEdgeNetworkFirewallRuleListQueryKey({ ip, ipOnFirewall }),
                (oldData: ApiResponse<number[]> | undefined) => ({
                  data: (oldData?.data || []).filter((seq) => seq !== sequence),
                }),
              );
              queryClient.removeQueries({
                queryKey:
                  getIpEdgeNetworkFirewallRuleDetailsQueryKey(ruleParams),
                exact: true,
              });
              return undefined;
            }
            return query.state.data?.data?.state !== IpEdgeFirewallRuleState.OK
              ? refetchInterval
              : undefined;
          },
        };
      },
    ),
    combine: (results) => ({
      isError: ruleListQuery.isError || results?.some((query) => query.isError),
      error:
        ruleListQuery.error || results?.find((query) => query.error)?.error,
      isLoading:
        ruleListQuery.isLoading || results?.some((query) => query.isLoading),
      data: (results
        ?.filter(Boolean)
        ?.map((query) => query?.data?.data)
        .sort((a, b) => {
          if (!a || !b) return 0;
          return a.sequence - b.sequence;
        }) || []),
    }),
  });
};
