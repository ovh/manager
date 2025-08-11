import {
  UseQueryOptions,
  useQuery,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getGameFirewallRuleQueryKey,
  getGameFirewallRuleDetailsQueryKey,
  getGameFirewallRuleList,
  getGameFirewallRuleDetails,
  IpGameFirewallRule,
} from '@/data/api';

export const useIpGameFirewallRules = ({
  refetchInterval,
  ip,
  ipOnGame,
}: {
  ip?: string;
  ipOnGame?: string;
  refetchInterval?: number;
}) => {
  const queryClient = useQueryClient();
  const ruleListQuery = useQuery<ApiResponse<number[]>, ApiError>({
    queryKey: getGameFirewallRuleQueryKey({ ip, ipOnGame }),
    queryFn: () => getGameFirewallRuleList({ ip, ipOnGame }),
    enabled: !!ip && !!ipOnGame,
  });

  const ruleQueries = useQueries({
    queries:
      ruleListQuery?.data?.data?.map(
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
    isLoading:
      ruleListQuery.isLoading || ruleQueries?.some((query) => query.isLoading),
    data: ruleQueries
      ?.map((query) => query?.data?.data)
      .sort((a, b) => a.protocol.localeCompare(b.protocol)),
  };
};
