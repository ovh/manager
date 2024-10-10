import { v6 } from '@ovh-ux/manager-core-api';
import { TPrivateNetwork } from '@/api/data/network';

export type TFloatingIp = {
  associatedEntity: string;
  id: string;
  ip: string;
  networkId: string;
  status: string;
  type: string;
};

export const getFloatingIps = async (projectId: string, region: string) => {
  const { data } = await v6.get<TFloatingIp[]>(
    `/cloud/project/${projectId}/region/${region}/floatingip`,
  );

  return data;
};

export const getRegionPrivateNetworks = async (
  projectId: string,
  region: string,
) => {
  const { data } = await v6.get<TPrivateNetwork[]>(
    `/cloud/project/${projectId}/region/${region}/network`,
  );

  return data;
};
