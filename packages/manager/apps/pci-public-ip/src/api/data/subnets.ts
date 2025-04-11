import { v6 } from '@ovh-ux/manager-core-api';

export type TSubnet = {
  cidr: string;
  gatewayIp: string;
  id: string;
};

export const getSubnetsUrl = (
  projectId: string,
  region: string,
  networkId: string,
) => `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`;

export const getSubnets = async (
  projectId: string,
  region: string,
  networkId: string,
): Promise<TSubnet[]> => {
  const { data } = await v6.get<TSubnet[]>(
    getSubnetsUrl(projectId, region, networkId),
  );
  return data;
};
