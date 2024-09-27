import { v6 } from '@ovh-ux/manager-core-api';
import { PROTOCOLS } from '@/constants';

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

export const deleteLoadBalancer = async (
  projectId: string,
  loadBalancer: TLoadBalancer,
): Promise<void> => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${loadBalancer.region}/loadbalancing/loadbalancer/${loadBalancer.id}`,
  );

  return data;
};

export type TLoadBalancerListener = {
  id: string;
  name: string;
  description: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  port: number;
  protocol: TProtocol;
  defaultPoolId: string;
};

export const getLoadBalancerListeners = async (
  projectId: string,
  region: string,
  loadBalancerId: string,
): Promise<TLoadBalancerListener[]> => {
  const { data } = await v6.get<TLoadBalancerListener[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/listener?loadbalancerId=${loadBalancerId}`,
  );

  return data;
};

export const updateLoadBalancerName = async (
  projectId: string,
  loadBalancer: TLoadBalancer,
  name: string,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/region/${loadBalancer.region}/loadbalancing/loadbalancer/${loadBalancer.id}`,
    {
      name,
    },
  );

  return data;
};

export type TLoadBalancerPool = {
  id: string;
  name: string;
  protocol: TProtocol;
  algorithm: string;
  operatingStatus: string;
  provisioningStatus: string;
  sessionPersistence: {
    type: string;
    cookieName: string;
  };
  loadbalancerId: string;
  listenerId: string;
};

export const getLoadBalancerPools = async (
  projectId: string,
  region: string,
  loadBalancerId: string,
): Promise<TLoadBalancerPool[]> => {
  const { data } = await v6.get<TLoadBalancerPool[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool?loadbalancerId=${loadBalancerId}`,
  );

  return data;
};

export type TProtocol = typeof PROTOCOLS[number];

interface CreateListenerProps {
  projectId: string;
  region: string;
  loadBalancerId: string;
  name: string;
  protocol: TProtocol;
  port: number;
  defaultPoolId?: string;
}

export const createListener = async ({
  projectId,
  region,
  loadBalancerId,
  name,
  protocol,
  port,
  defaultPoolId,
}: CreateListenerProps) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/listener`,
    {
      loadbalancerId: loadBalancerId,
      name,
      protocol,
      port,
      defaultPoolId,
    },
  );

  return data;
};

interface EditListenerProps {
  projectId: string;
  region: string;
  listenerId: string;
  name?: string;
  defaultPoolId?: string;
}

export const editListener = async ({
  projectId,
  region,
  listenerId,
  name,
  defaultPoolId,
}: EditListenerProps) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
    {
      name,
      defaultPoolId,
    },
  );

  return data;
};
