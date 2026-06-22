import { v6 } from '@ovh-ux/manager-core-api';

export const getPublicCloudLoadBalancers = async (
  projectId: string,
): Promise<unknown[]> => {
  const { data } = await v6.get<unknown[]>(
    `/cloud/project/${projectId}/loadbalancer`,
  );

  return data ?? [];
};
