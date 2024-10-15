import { v6 } from '@ovh-ux/manager-core-api';
import { TInstance } from '@ovh-ux/manager-pci-common';
import {
  FLOATING_IP_CREATE_DESCRIPTION,
  FLOATING_IP_TYPE,
  PROTOCOLS,
} from '@/constants';
import { TRegion } from '@/api/hook/usePlans';
import { TPrivateNetwork, TSubnet } from '@/api/data/network';
import { ListenerConfiguration } from '@/components/create/InstanceTable.component';
import { TFloatingIp } from '@/api/data/floating-ips';

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

export type TCreateLoadBalancerParam = {
  projectId: string;
  flavor: TFlavor;
  region: TRegion;
  floatingIp: TFloatingIp;
  privateNetwork: TPrivateNetwork;
  subnet: TSubnet;
  gateways: { id: string }[];
  listeners: ListenerConfiguration[];
  name: string;
};

export const createLoadBalancer = async ({
  projectId,
  flavor,
  region,
  floatingIp,
  privateNetwork,
  subnet,
  gateways,
  listeners,
  name,
}: Readonly<TCreateLoadBalancerParam>) => {
  type TNetworkParam = {
    private: {
      network: {
        id: string;
        subnetId: string;
      };
      floatingIpCreate?: {
        description: string;
      };
      floatingIp?: {
        id: string;
      };
      gatewayCreate?: {
        model: string;
        name: string;
      };
      gateway?: {
        id: string;
      };
    };
  };

  const network: TNetworkParam = {
    private: {
      network: {
        id: privateNetwork.id,
        subnetId: subnet.id,
      },
    },
  };

  if (floatingIp.type === FLOATING_IP_TYPE.CREATE) {
    network.private.floatingIpCreate = {
      description: `${FLOATING_IP_CREATE_DESCRIPTION} ${name}`,
    };
  }

  if (
    ![FLOATING_IP_TYPE.CREATE, FLOATING_IP_TYPE.NO_IP].includes(floatingIp.type)
  ) {
    network.private.floatingIp = {
      id: floatingIp.id,
    };
  }

  if (network.private.floatingIp || network.private.floatingIpCreate) {
    if (!gateways?.length) {
      network.private.gatewayCreate = {
        model: 's',
        name: `gateway-${region.name}`,
      };
    } else {
      network.private.gateway = {
        id: gateways[0].id,
      };
    }
  }

  const formattedListeners =
    listeners?.map((listener) => {
      const pool: {
        algorithm: string;
        protocol: string;
        healthMonitor?: {
          name: string;
          monitorType: string;
          maxRetries: number;
          delay: number;
          timeout: number;
          httpConfiguration: {
            httpMethod: string;
            urlPath: string;
          };
        };
        members?: TInstance[];
      } = {
        algorithm: 'roundRobin',
        protocol: listener.protocol,
      };

      const instances = listener.instances?.reduce((filtered, instance) => {
        if (Object.keys(instance).length > 0) {
          filtered.push({
            address: instance.instance.ipAddresses[0].ip,
            protocolPort: instance.port,
          });
        }
        return filtered;
      }, []);

      if (listener.healthMonitor) {
        pool.healthMonitor = {
          name: `health-monitor-${listener.healthMonitor}`,
          monitorType: listener.healthMonitor,
          maxRetries: 4,
          delay: 5,
          timeout: 4,
          httpConfiguration: {
            httpMethod: 'GET',
            urlPath: '/',
          },
        };
      }

      if (instances.length) {
        pool.members = instances;
      }

      return {
        port: listener.port,
        protocol: listener.protocol,
        pool,
      };
    }) || [];

  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region.name}/loadbalancing/loadbalancer`,
    {
      flavorId: flavor.id,
      network,
      name,
      listeners: formattedListeners,
    },
  );

  return data;
};
