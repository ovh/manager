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

export type TPrivateNetwork = {
  id: string;
  name: string;
  status: string;
  type: string;
  vlanId: number;
  visibility: string;
  regions: {
    openstackId: string;
    region: string;
    status: string;
  }[];
};

export type TSubnet = {
  id: string;
  name: string;
  cidr: string;
  ipVersion: number;
  dhcpEnabled: boolean;
  gatewayIp: string;
  allocationPools: {
    start: string;
    end: string;
  }[];
  hostRoutes: string[];
  dnsNameServers: string[];
};

export const getPrivateNetworks = async (projectId: string) => {
  const { data } = await v6.get<TPrivateNetwork[]>(
    `/cloud/project/${projectId}/network/private`,
  );
  return data;
};

export const getPrivateNetworkSubnets = async (
  projectId: string,
  region: string,
  networkId: string,
): Promise<TSubnet[]> => {
  const { data } = await v6.get<TSubnet[]>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
  );
  return data;
};
