import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
  TProtocol,
} from './load-balancer';

export type TLoadBalancerPool = {
  id: string;
  name: string;
  protocol: TProtocol;
  algorithm: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
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

export const deletePool = async (
  projectId: string,
  region: string,
  poolId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}`,
  );
  return data;
};

export const createPool = async ({
  projectId,
  region,
  loadbalancerId,
  name,
  algorithm,
  protocol,
  permanentSession,
}: {
  projectId: string;
  region: string;
  loadbalancerId: string;
  name: string;
  algorithm: string;
  protocol: string;
  permanentSession: {
    isEnabled: boolean;
    type?: string;
    cookieName?: string;
  };
}): Promise<TLoadBalancerPool> => {
  const { data } = await v6.post<TLoadBalancerPool>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool`,
    {
      loadbalancerId,
      name,
      algorithm,
      protocol,
      sessionPersistence: permanentSession.isEnabled
        ? {
            type: permanentSession.type,
            cookieName: permanentSession.cookieName,
          }
        : null,
    },
  );

  return data;
};
