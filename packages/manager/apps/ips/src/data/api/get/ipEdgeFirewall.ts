import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpEdgeFirewallParams = {
  /**  */
  ipGroup: string;
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
  `get/ip/${encodeURIComponent(params.ipGroup)}/firewall`,
];

export const getIpEdgeFirewall = async (
  params: GetIpEdgeFirewallParams,
): Promise<IcebergFetchResultV6<IpEdgeFirewallType>> =>
  fetchIcebergV6<IpEdgeFirewallType>({
    route: `/ip/${encodeURIComponent(params.ipGroup)}/firewall`,
    page: 1,
  });
