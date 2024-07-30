import { v6 } from '@ovh-ux/manager-core-api';

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
