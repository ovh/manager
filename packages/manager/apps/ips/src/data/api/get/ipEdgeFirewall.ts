import {
  IcebergFetchResultV6,
  fetchIcebergV6,
  ApiResponse,
  v6,
} from '@ovh-ux/manager-core-api';

export type GetIpEdgeFirewallParams = {
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

export const postIpEdgeFirewall = async (params: {
  ip: string;
  ipOnFirewall: string;
}): Promise<ApiResponse<IpEdgeFirewallType>> =>
  v6.post(`/ip/${encodeURIComponent(params.ip)}/firewall`, {
    ipOnFirewall: params.ipOnFirewall,
  });

export const putIpEdgeFirewall = async (params: {
  ip: string;
  ipOnFirewall: string;
  enabled: boolean;
}): Promise<void> =>
  v6.put(
    `/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
      params.ipOnFirewall,
    )}`,
    { enabled: params.enabled },
  );

export const deleteIpEdgeFirewall = async (params: {
  ip: string;
  ipOnFirewall: string;
}): Promise<ApiResponse<string>> =>
  v6.delete(
    `/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
      params.ipOnFirewall,
    )}`,
  );

export const getIpEdgeNetworkFirewallRuleListQueryKey = (params: {
  ip: string;
  ipOnFirewall: string;
  state?: IpEdgeFirewallStateEnum;
}) => [
  `get/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
    params.ipOnFirewall,
  )}/rule`,
  params.state,
];

export const getIpEdgeNetworkFirewallRuleList = async (params: {
  ip: string;
  ipOnFirewall: string;
  state?: IpEdgeFirewallStateEnum;
}): Promise<ApiResponse<number[]>> =>
  v6.get<number[]>(
    `/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
      params.ipOnFirewall,
    )}/rule${params.state ? `?state=${params.state}` : ''}`,
  );

export enum IpEdgeFirewallProtocol {
  AH = 'ah',
  ESP = 'esp',
  GRE = 'gre',
  ICMP = 'icmp',
  IPv4 = 'ipv4',
  TCP = 'tcp',
  UDP = 'udp',
}

export function getIpEdgeFirewallProtocolLabelFromValue(protocol: string) {
  return Object.entries(IpEdgeFirewallProtocol).find(
    ([, value]) => value === protocol,
  )?.[0];
}

export enum IpEdgeFirewallRuleState {
  CREATION_PENDING = 'creationPending',
  OK = 'ok',
  REMOVAL_PENDING = 'removalPending',
}

export type IpEdgeFirewallRule = {
  action: 'deny' | 'permit';
  creationDate: string;
  destination: string;
  destinationPort: string | null;
  fragments: boolean | null;
  protocol: IpEdgeFirewallProtocol;
  rule: string;
  sequence: number;
  source: string;
  sourcePort: string | null;
  state: IpEdgeFirewallRuleState;
  tcpOption: string | null;
};

export const postIpEdgeNetworkFirewallRule = async ({
  ip,
  ipOnFirewall,
  ...params
}: {
  ip: string;
  ipOnFirewall: string;
  action: 'permit' | 'deny';
  destinationPort: number;
  protocol: IpEdgeFirewallProtocol;
  sequence: number;
  source: string;
  sourcePort: number;
  tcpOption: {
    fragments: boolean | null;
    option: 'established' | 'syn' | null;
  };
}): Promise<ApiResponse<IpEdgeFirewallRule>> =>
  v6.post(
    `/ip/${encodeURIComponent(ip)}/firewall/${encodeURIComponent(
      ipOnFirewall,
    )}/rule`,
    params,
  );

export const getIpEdgeNetworkFirewallRuleDetailsQueryKey = (params: {
  ip: string;
  ipOnFirewall: string;
  sequence: number;
}) => [
  `get/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
    params.ipOnFirewall,
  )}/rule/${params.sequence}`,
];

export const getIpEdgeNetworkFirewallRuleDetails = async (params: {
  ip: string;
  ipOnFirewall: string;
  sequence: number;
}): Promise<ApiResponse<IpEdgeFirewallRule>> =>
  v6.get(
    `/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
      params.ipOnFirewall,
    )}/rule/${params.sequence}`,
  );

export const deleteIpEdgeNetworkFirewallRule = async (params: {
  ip: string;
  ipOnFirewall: string;
  sequence: number;
}): Promise<ApiResponse<IpEdgeFirewallRule>> =>
  v6.delete(
    `/ip/${encodeURIComponent(params.ip)}/firewall/${encodeURIComponent(
      params.ipOnFirewall,
    )}/rule/${params.sequence}`,
  );
