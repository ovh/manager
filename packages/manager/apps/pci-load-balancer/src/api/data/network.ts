import { v6 } from '@ovh-ux/manager-core-api';

export type TNetwork = {
  id: string;
  name: string;
  visibility: string;
  vlanId: number;
};

export const getPrivateNetworkByRegion = async (
  projectId: string,
  region: string,
  networkId: string,
): Promise<TNetwork> => {
  const { data } = await v6.get<TNetwork>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}`,
  );

  return data;
};

export type TSubnet = {
  cidr: string;
  gatewayIp: string;
  id: string;
};

export const getSubnetByNetworkAndRegion = async (
  projectId: string,
  region: string,
  networkId: string,
  subnetId: string,
): Promise<TSubnet> => {
  const { data } = await v6.get<TSubnet>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet/${subnetId}`,
  );

  return data;
};