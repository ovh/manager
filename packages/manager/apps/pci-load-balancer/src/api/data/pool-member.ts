import { v6 } from '@ovh-ux/manager-core-api';
import {
  LoadBalancerOperatingStatusEnum,
  LoadBalancerProvisioningStatusEnum,
} from './load-balancer';

export type TPoolMember = {
  id: string;
  name: string;
  operatingStatus: LoadBalancerOperatingStatusEnum;
  provisioningStatus: LoadBalancerProvisioningStatusEnum;
  address: string;
  protocolPort: number;
  weight: number;
  search?: string;
};

export const getPoolMembers = async (
  projectId: string,
  region: string,
  poolId: string,
): Promise<TPoolMember[]> => {
  const { data } = await v6.get<TPoolMember[]>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member`,
  );
  return data;
};
