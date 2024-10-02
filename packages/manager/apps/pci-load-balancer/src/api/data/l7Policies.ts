import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from '@/api/data/load-balancer';

export type TL7Policy = {
  id: string;
  name: string;
  description: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  redirectHttpCode: number | null;
  redirectPoolId: string | null;
  redirectPrefix: string | null;
  redirectUrl: string | null;
  action: string;
  position: number;
  listenerId: string;
  attribute?: string;
  search?: string;
};

export const getL7Policies = async (
  projectId: string,
  listenerId: string,
  region: string,
): Promise<TL7Policy[]> => {
  const { data } = await v6.get<TL7Policy[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy?listenerId=${listenerId}`,
  );
  return data;
};

export const getPolicy = async (
  projectId: string,
  region: string,
  policyId: string,
): Promise<TL7Policy> => {
  const { data } = await v6.get<TL7Policy>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
  );
  return data;
};

export const deletePolicy = async (
  projectId: string,
  region: string,
  policyId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/l7Policy/${policyId}`,
  );
  return data;
};
