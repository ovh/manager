import { CountryCode } from '@ovh-ux/manager-config';
import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { ServiceStatus } from '@/types';

export type DedicatedCloudLocation = {
  city: string;
  countryCode: CountryCode;
  id: number;
  pccZone: string;
  region: string;
  regionLocation: string;
};

export const getDedicatedCloudServiceLocation = (
  serviceName: string,
): Promise<ApiResponse<DedicatedCloudLocation>> =>
  apiClient.v6.get(`/dedicatedCloud/${serviceName}/location`);

export type DedicatedCloudServiceInfos = {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string | null;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean | null;
    period: number | boolean;
  };
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

export const getDedicatedCloudServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<DedicatedCloudServiceInfos>> =>
  apiClient.v6.get(`/dedicatedCloud/${serviceName}/serviceInfos`);

export const getDedicatedCloudOrderableIpCountries = (
  serviceName: string,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get(`/dedicatedCloud/${serviceName}/orderableIpCountries`);
