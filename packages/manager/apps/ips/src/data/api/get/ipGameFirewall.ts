import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

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
