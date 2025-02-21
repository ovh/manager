import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { ServiceStatus } from '@/types';

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

export const getDedicatedServerData = (
  serverName: string,
): Promise<ApiResponse<DedicatedServer>> =>
  apiClient.v6.get(`/dedicated/server/${serverName}`);

export type DedicatedServerServiceInfos = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean | null;
    period: number | null;
  } | null;
  renewalType:
    | 'automaticForcedProduct'
    | 'automaticV2012'
    | 'automaticV2014'
    | 'automaticV2016'
    | 'automaticV2024'
    | 'manual'
    | 'oneShot'
    | 'option';
  serviceId: number;
  status: ServiceStatus;
};

export const getDedicatedServerServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<DedicatedServerServiceInfos>> =>
  apiClient.v6.get(`/dedicated/server/${serviceName}/serviceInfos`);

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
