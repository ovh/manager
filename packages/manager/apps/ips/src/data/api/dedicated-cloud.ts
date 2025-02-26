import { CountryCode } from '@ovh-ux/manager-config';
import {
  ApiResponse,
  IcebergFetchResultV6,
  apiClient,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { ServiceStatus } from '@/types';

export type DedicatedCloudService = {
  advancedSecurity: boolean;
  webInterfaceUrl: string;
  billingType: 'monthly' | 'demo';
  managementInterface:
    | 'azure'
    | 'openstack'
    | 'systemcenter'
    | 'vcloud'
    | 'vcsa'
    | 'vsphere';
  userSessionTimeout: number;
  bandwidth: string;
  description: string;
  productReference: 'EPCC' | 'MBM';
  generation: '1.0' | '2.0';
  state:
    | 'available'
    | 'delivered'
    | 'disabled'
    | 'disabling'
    | 'error'
    | 'migrating'
    | 'provisionning'
    | 'recycling'
    | 'reserved'
    | 'toDisable'
    | 'toProvision'
    | 'toRecycle'
    | 'toRemove'
    | 'toUnprovision'
    | 'unprovisionning'
    | 'upgrading';
  canMigrateToVCD: boolean;
  userAccessPolicy: 'filtered' | 'open';
  commercialRange: string;
  certifiedInterfaceUrl: string;
  vScopeUrl: string;
  version: { minor: string; build: string; major: string };
  serviceName: string;
  userLogoutPolicy: 'first' | 'last';
  servicePackName?: string | null;
  spla: boolean;
  userLimitConcurrentSession: number;
  sslV3?: boolean | null;
  location: string;
  iam: IamObject;
};

export const getDedicatedCloudServiceList = async (): Promise<IcebergFetchResultV6<{
  serviceName: string;
  displayName: string;
}>> => {
  const response = await fetchIcebergV6<DedicatedCloudService>({
    route: '/dedicatedCloud',
    pageSize: 1000,
  });

  return {
    ...response,
    data: response.data.map(({ serviceName, description }) => ({
      serviceName,
      displayName: description || serviceName,
    })),
  };
};

export const getDedicatedCloudServiceData = (
  serviceName: string,
): Promise<ApiResponse<DedicatedCloudService>> =>
  apiClient.v6.get(`/dedicatedCloud/${serviceName}`);

export type DedicatedCloudLocation = {
  city: string;
  countryCode: CountryCode;
  id: number;
  pccZone: string;
  region: string;
  regionLocation: string;
};

export const getDedicatedCloudServiceLocation = (
  pccZone: string,
): Promise<ApiResponse<DedicatedCloudLocation>> =>
  apiClient.v6.get(`/dedicatedCloud/location/${pccZone}`);

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
