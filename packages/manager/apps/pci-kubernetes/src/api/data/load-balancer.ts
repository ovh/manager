import { v6 } from '@ovh-ux/manager-core-api';

export type TLoadBalancer = {
  id: string;
  region: string;
};

export const getLoadBalancers = async (projectId: string): Promise<TLoadBalancer[]> => {
  const { data } = await v6.get<TLoadBalancer[]>(`/cloud/project/${projectId}/loadbalancer`);

  return data;
};
