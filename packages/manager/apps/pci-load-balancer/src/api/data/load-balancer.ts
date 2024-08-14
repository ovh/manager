import { v6 } from '@ovh-ux/manager-core-api';

export enum LoadBalancerOperatingStatusEnum {
  ONLINE = 'online',
  OFFLINE = 'offline',
  DEGRADED = 'degraded',
  DRAINING = 'draining',
  NO_MONITOR = 'noMonitor',
  ERROR = 'error',
}

export enum LoadBalancerProvisioningStatusEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
  CREATING = 'creating',
  DELETING = 'deleting',
  UPDATING = 'updating',
  ERROR = 'error',
}

export type TLoadBalancer = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  flavorId: string;
  floatingIp: string | null;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  vipAddress: string;
  vipNetworkId: string;
  vipSubnetId: string;
  region: string;
};

export type TLoadBalancerResponse = {
  resources: TLoadBalancer[];
  errors: unknown[];
};

export const getLoadBalancers = async (
  projectId: string,
): Promise<TLoadBalancerResponse> => {
  const { data } = await v6.get<TLoadBalancerResponse>(
    `/cloud/project/${projectId}/aggregated/loadbalancer`,
  );

  return data;
};

export const getLoadBalancer = async (
  projectId: string,
  region: string,
  loadBalancerId: string,
): Promise<TLoadBalancer> => {
  const { data } = await v6.get<TLoadBalancer>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/loadbalancer/${loadBalancerId}`,
  );

  return data;
};

export type TFlavor = {
  id: string;
  name: string;
  region: string;
};

export const getLoadBalancerFlavor = async (
  projectId: string,
  region: string,
  flavorId: string,
): Promise<TFlavor> => {
  const { data } = await v6.get<TFlavor>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/flavor/${flavorId}`,
  );

  return data;
};