import { v6 } from '@ovh-ux/manager-core-api';

export type TFloatingIp = {
  associatedEntity: string;
  id: string;
  ip: string;
  networkId: string;
  status: string;
};

export const getFloatingIps = async (projectId: string, region: string) => {
  const { data } = await v6.get<TFloatingIp[]>(
    `/cloud/project/${projectId}/region/${region}/floatingip`,
  );

  return data;
};
