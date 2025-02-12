import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type VPS = {
  availableOptions: string[];
  canOrder: boolean;
  cluster: string;
  creation: string;
  diskPercent: number;
  diskTotal: { unit: string; value: number };
  diskUsed: { unit: string; value: number };
  displayName: string;
  distribution: null;
  engagement: { defaultEndAction: string; duration: string; type: string };
  expiration: string;
  hasBackup: boolean;
  hasVeeam: boolean;
  ipv4: string;
  ipv6: string;
  isExpired: boolean;
  isValidVersionToRescheduleAutomatedBackup: boolean;
  messages: string[];
  model: string;
  monitoringIpBlocks: string[];
  name: string;
  netbootMode: string;
  noVNC: boolean;
  offerType: string;
  ram: { unit: string; value: number };
  reverseDns: null;
  secondaryDns: number;
  shouldReengage: boolean;
  slaMonitoring: boolean;
  state: string;
  tabs: unknown;
  traficPercent: number;
  traficTotal: { unit: string; value: number };
  traficUsed: { unit: string; value: number };
  vcore: number;
  version: string;
  zone: string;
  location: {
    country: string;
    datacentre: string;
    longName: string;
  };
};

export const getVpsData = (serviceName: string): Promise<ApiResponse<VPS>> =>
  apiClient.aapi.get(`/sws/vps/${serviceName}/info`);

export type VpsServiceInfos = {
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
  status:
    | 'autorenewInProgress'
    | 'expired'
    | 'inCreation'
    | 'ok'
    | 'pendingDebt'
    | 'unPaid';
};

export const getVpsServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<VpsServiceInfos>> =>
  apiClient.v6.get(`/vps/${serviceName}/serviceInfos`);
