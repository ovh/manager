import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { ServiceStatus } from '@/types';

export type VPS = {
  cluster: string;
  displayName: string;
  model: {
    disk: number;
    name: string;
    offer: string;
    vcore: number;
    memory: number;
    version: string;
    datacenter: string[];
    availableOptions: string[];
    maximumAdditionnalIp: number;
  };
  monitoringIpBlocks: string[];
  name: string;
  netbootMode: string;
  offerType: string;
  slaMonitoring: boolean;
  state: string;
  vcore: number;
  zone: string;
  keymap: string | null;
  memoryLimit: number;
  iam: IamObject;
};

export type VpsDatacenter = {
  country: string;
  name: string;
  longName: string;
};

export const getVpsDatacenter = (
  serviceName: string,
): Promise<ApiResponse<VpsDatacenter>> =>
  apiClient.v6.get(`/vps/${serviceName}/datacenter`);

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
  status: ServiceStatus;
};

export const getVpsServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<VpsServiceInfos>> =>
  apiClient.v6.get(`/vps/${serviceName}/serviceInfos`);

export const getVpsOrderableIpCountries = (
  serviceName: string,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get(`/vps/${serviceName}/ipCountryAvailable`);
