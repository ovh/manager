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

export const deletePoolMember = async (
  projectId: string,
  region: string,
  poolId: string,
  memberId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
  );
  return data;
};

export const getPoolMember = async (
  projectId: string,
  region: string,
  poolId: string,
  memberId: string,
): Promise<TPoolMember> => {
  const { data } = await v6.get<TPoolMember>(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
  );
  return data;
};

export const updatePoolMemberName = async (
  projectId: string,
  region: string,
  poolId: string,
  memberId: string,
  name: string,
) => {
  const { data } = await v6.put(
    `/cloud/project/${projectId}/region/${region}/loadbalancing/pool/${poolId}/member/${memberId}`,
    {
      name,
    },
  );
  return data;
};
