import {
  ApiResponse,
  IcebergFetchResultV6,
  fetchIcebergV6,
  v6,
} from '@ovh-ux/manager-core-api';

export type GetIpGameFirewallParams = {
  /**  */
  ip: string;
};

export enum IpGameFirewallStateEnum {
  PENDING_CLEAN_RULE = 'cleanRulesPending',
  PENDING_DISABLE = 'firewallModeDisablePending',
  PENDING_ENABLE = 'firewallModeEnablePending',
  OK = 'ok',
}

export type IpGameFirewallType = {
  firewallModeEnabled: boolean;
  ipOnGame: string;
  maxRules: number;
  state: IpGameFirewallStateEnum;
  supportedProtocols?: string[];
};

export const getIpGameFirewallQueryKey = (params: GetIpGameFirewallParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/game`,
];

export const getIpGameFirewall = async (
  params: GetIpGameFirewallParams,
): Promise<IcebergFetchResultV6<IpGameFirewallType>> =>
  fetchIcebergV6<IpGameFirewallType>({
    route: `/ip/${encodeURIComponent(params.ip)}/game`,
    page: 1,
  });

export type GetGameFirewallRuleParams = {
  ip: string;
  ipOnGame: string;
};

export const getGameFirewallRuleQueryKey = (
  params: GetGameFirewallRuleParams,
) => [
  `get/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(
    params.ipOnGame,
  )}/rule`,
];

export const getGameFirewallRuleList = async (
  params: GetGameFirewallRuleParams,
): Promise<ApiResponse<number[]>> =>
  v6.get<number[]>(
    `/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(
      params.ipOnGame,
    )}/rule`,
  );

export type GetGameFirewallRuleDetailsParams = GetGameFirewallRuleParams & {
  ruleId: number;
};

export type RuleStatus = 'createRulePending' | 'deleteRulePending' | 'ok';

export type IpGameFirewallRule = {
  protocol: string;
  state: RuleStatus;
  id: number;
  ports: { from: number; to: number };
};

export const getGameFirewallRuleDetailsQueryKey = (
  params: GetGameFirewallRuleDetailsParams,
) => [...getGameFirewallRuleQueryKey(params), params.ruleId];

export const getGameFirewallRuleDetails = async (
  params: GetGameFirewallRuleDetailsParams,
): Promise<ApiResponse<IpGameFirewallRule>> =>
  v6.get<IpGameFirewallRule>(
    `/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(
      params.ipOnGame,
    )}/rule/${params.ruleId}`,
  );
