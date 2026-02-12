import {
  UseQueryOptions,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  IpGameFirewallRule,
  getGameFirewallRuleDetails,
  getGameFirewallRuleDetailsQueryKey,
  getGameFirewallRuleList,
  getGameFirewallRuleQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';

export const useIpGameFirewallRuleList = ({
  ip,
  ipOnGame,
  enabled = true,
}: {
  ip?: string;
  ipOnGame?: string;
  enabled?: boolean;
}) =>
  useQuery<ApiResponse<number[]>, ApiError>({
    queryKey: getGameFirewallRuleQueryKey({ ip, ipOnGame }),
    queryFn: () => getGameFirewallRuleList({ ip, ipOnGame }),
    enabled: !!ip && !!ipOnGame && enabled,
  });

export const useIpGameFirewallRules = ({
  refetchInterval = INVALIDATED_REFRESH_PERIOD,
  ip,
  ipOnGame,
}: {
  ip?: string;
  ipOnGame?: string;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();
  const ruleListQuery = useIpGameFirewallRuleList({ ip, ipOnGame });

  const ruleQueries = useQueries({
    queries:
      !ip || !ipOnGame
        ? []
        : ruleListQuery?.data?.data?.map(
            (
              ruleId,
            ): UseQueryOptions<ApiResponse<IpGameFirewallRule>, ApiError> => {
              const ruleParams = { ip, ipOnGame, ruleId };
              return {
                queryKey: getGameFirewallRuleDetailsQueryKey(ruleParams),
                queryFn: () => getGameFirewallRuleDetails(ruleParams),
                enabled: !!ip && !!ipOnGame,
                retry: false,
                refetchInterval: (query) => {
                  if (query.state.error) {
                    queryClient.invalidateQueries({
                      queryKey: getGameFirewallRuleQueryKey(ruleParams),
                      exact: true,
                    });
                    queryClient.removeQueries({
                      queryKey: getGameFirewallRuleDetailsQueryKey(ruleParams),
                      exact: true,
                    });
                    return undefined;
                  }
                  return query.state.data?.data?.state !== 'ok'
                    ? refetchInterval
                    : undefined;
                },
              };
            },
          ) || [],
  });

  return {
    isError:
      ruleListQuery.isError || ruleQueries?.some((query) => query.isError),
    error:
      ruleListQuery.error || ruleQueries?.find((query) => query.error)?.error,
    loading:
      ruleListQuery.isLoading || ruleQueries?.some((query) => query.isLoading),
    data:
      ruleQueries
        ?.map((query) => query?.data?.data)
        .sort((a, b) => {
          if (!a) return 1;
          if (!b) return -1;
          if (!a.protocol || !b.protocol) return 0;
          return a.protocol?.localeCompare(b.protocol);
        }) || ([] as IpGameFirewallRule[]),
  };
};
