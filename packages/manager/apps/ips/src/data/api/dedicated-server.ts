import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';

export type DedicatedServer = {
  ip: string;
  linkSpeed: number;
  newUpgradeSystem: boolean;
  region: string;
  name: string;
  commercialRange: string | null;
  rack: string;
  rescueSshKey: null;
  supportLevel: 'pro' | 'critical' | 'fastpath' | 'gs';
  os: string;
  efiBootloaderPath: string | null;
  rootDevice: string | null;
  professionalUse: boolean;
  rescueMail: string | null;
  bootId: number;
  serverId: number;
  bootScript: string | null;
  availabilityZone: string;
  state: 'ok' | 'error' | 'hacked' | 'hackedBlocked';
  datacenter: string;
  monitoring: boolean;
  reverse: string;
  powerState: 'poweron' | 'poweroff';
  noIntervention: boolean;
  iam: IamObject;
};

export const getDedicatedServerInfo = (
  serverName: string,
): Promise<ApiResponse<DedicatedServer>> =>
  apiClient.v6.get(`/dedicated/server/${serverName}`);

export type OrderableIp = {
  optionRequired?: 'professionalUse' | null;
  blockSizes: number[];
  included: boolean;
  ipNumber: number | null;
  number: number;
  type: 'failover' | 'unshielded' | 'static';
};

export type OrderableIpResponse = {
  ipv4: OrderableIp[];
  ipv6: OrderableIp[];
};

export const getOrderableIpInfo = (
  serverName: string,
): Promise<OrderableIpResponse> =>
  apiClient.v6.get(`/dedicated/server/${serverName}/orderable/ip`);
