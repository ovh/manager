import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export type GetIpGameFirewallParams = {
  ip: string;
  ipOnGame: string;
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
  `get/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(params.ipOnGame)}`,
];

export const getIpGameFirewall = async (
  params: GetIpGameFirewallParams,
): Promise<ApiResponse<IpGameFirewallType>> =>
  v6.get<IpGameFirewallType>(
    `/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(params.ipOnGame)}`,
  );

export type GetGameFirewallRuleParams = {
  ip?: string;
  ipOnGame?: string;
};

export const getGameFirewallRuleQueryKey = ({
  ip,
  ipOnGame,
}: GetGameFirewallRuleParams) => [
  `get/ip/${encodeURIComponent(ip)}/game/${encodeURIComponent(ipOnGame)}/rule`,
];

export const getGameFirewallRuleList = async ({
  ip,
  ipOnGame,
}: GetGameFirewallRuleParams): Promise<ApiResponse<number[]>> =>
  v6.get<number[]>(
    `/ip/${encodeURIComponent(ip)}/game/${encodeURIComponent(ipOnGame)}/rule`,
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

export const getGameFirewallRuleDetails = async ({
  ip,
  ipOnGame,
  ruleId,
}: GetGameFirewallRuleDetailsParams): Promise<
  ApiResponse<IpGameFirewallRule>
> => {
  if (!ip || !ipOnGame) {
    return Promise.reject(new Error('ip and ipOnGame parameters are required'));
  }

  return v6.get<IpGameFirewallRule>(
    `/ip/${encodeURIComponent(ip)}/game/${encodeURIComponent(ipOnGame)}/rule/${ruleId}`,
  );
};
