import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpEdgeFirewallParams = {
  /**  */
  ip: string;
};

export enum IpEdgeFirewallStateEnum {
  PENDING_DISABLE = 'disableFirewallPending',
  PENDING_ENABLE = 'enableFirewallPending',
  OK = 'ok',
}

export type IpEdgeFirewallType = {
  enabled: boolean;
  ipOnFirewall: string;
  state: IpEdgeFirewallStateEnum;
};

export const getIpEdgeFirewallQueryKey = (params: GetIpEdgeFirewallParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/firewall`,
];

export const getIpEdgeFirewall = async (
  params: GetIpEdgeFirewallParams,
): Promise<IcebergFetchResultV6<IpEdgeFirewallType>> =>
  fetchIcebergV6<IpEdgeFirewallType>({
    route: `/ip/${encodeURIComponent(params.ip)}/firewall`,
    page: 1,
  });
