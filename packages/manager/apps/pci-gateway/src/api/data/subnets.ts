import { v6 } from '@ovh-ux/manager-core-api';

export type TSubnet = {
  id: string;
};

export const getSubnetsUrl = (
  projectId: string,
  regionName: string,
  networkId: string,
) =>
  `/cloud/project/${projectId}/region/${regionName}/network/${networkId}/subnet`;

export const getSubnets = async (
  projectId: string,
  regionName: string,
  networkId: string,
): Promise<TSubnet[]> => {
  const { data } = await v6.get<TSubnet[]>(
    getSubnetsUrl(projectId, regionName, networkId),
  );
  return data;
};
