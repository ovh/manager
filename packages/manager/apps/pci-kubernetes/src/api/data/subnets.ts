import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export type TGateway = {
  externalInformation: {
    ips: {
      ip: string;
      subnet: string;
    }[];
  } | null;
  networkId: string;
  id: string;
  interfaces: {
    id: string;
    ip: string;
    networkId: string;
    subnetId: string;
  }[];
  model: '2xl' | '3xl' | 'l' | 'm' | 's' | 'xl';
  name: string;
  region: string;
  status: 'active' | 'building' | 'down' | 'error';
};

export type TPrivateNetworkSubnet = {
  id: string;
  cidr: string;
  gatewayIp: string;
  displayedLabel?: string;
  ipPools: {
    dhcp: boolean;
    end: string;
    network: string;
    region: string;
    start: string;
  }[];
};

export const getPrivateNetworkSubnets = async (
  projectId: string,
  privateNetworkId: string,
): Promise<TPrivateNetworkSubnet[]> => {
  const { data } = await v6.get<TPrivateNetworkSubnet[]>(
    `/cloud/project/${projectId}/network/private/${privateNetworkId}/subnet`,
  );
  return data;
};

export const getRegionSubnets = async (
  projectId: string,
  regionName: string,
  networkId: string,
): Promise<TPrivateNetworkSubnet[]> => {
  const { data } = await fetchIcebergV6<TPrivateNetworkSubnet>({
    route: `/cloud/project/${projectId}/region/${regionName}/network/${networkId}/subnet`,
    disableCache: true,
  });
  return data;
};

export const getListGateways = async (projectId: string, regionName: string, subnetId: string) => {
  const { data } = await v6.get<TGateway[]>(
    `/cloud/project/${projectId}/region/${regionName}/gateway?subnetId=${subnetId}`,
  );
  return data;
};
