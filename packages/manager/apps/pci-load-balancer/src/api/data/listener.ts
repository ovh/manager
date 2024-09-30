import { v6 } from '@ovh-ux/manager-core-api';
import { TLoadBalancerListener } from '@/api/data/load-balancer';

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
