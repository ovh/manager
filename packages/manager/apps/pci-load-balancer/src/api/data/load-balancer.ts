import { v6 } from '@ovh-ux/manager-core-api';
import { TLoadBalancerResponse } from '@/types';

export const getLoadBalancers = async (
  projectId: string,
): Promise<TLoadBalancerResponse> => {
  const { data } = await v6.get<TLoadBalancerResponse>(
    `/cloud/project/${projectId}/aggregated/loadbalancer`,
  );
  return data;
};
