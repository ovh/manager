import { v6 } from '@ovh-ux/manager-core-api';

type AllocationPools = {
  start: string;
  end: string;
};

export type TSubnet = {
  allocationPools?: AllocationPools[];
  allocatedIp?: string;
  cidr: string;
  dhcpEnabled: boolean;
  gatewayIp: string | null;
  gatewayName: string;
  networkId: string;
  region: string;
  ipVersion: number;
  id: string;
  name: string;
};

export const getSubnets = async (
  projectId: string,
  networkId: string,
  region: string,
): Promise<TSubnet> => {
  const { data } = await v6.get<TSubnet>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
  );

  return data[0];
};
