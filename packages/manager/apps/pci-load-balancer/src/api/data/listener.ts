import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
  TProtocol,
} from '@/api/data/load-balancer';

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

export const deleteListener = async (
  projectId: string,
  region: string,
  listenerId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
  );
  return data;
};

export const getListener = async (
  projectId: string,
  region: string,
  listenerId: string,
): Promise<TLoadBalancerListener> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
  );
  return data;
};
