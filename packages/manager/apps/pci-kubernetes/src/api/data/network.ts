import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  region: string;
  status: string;
  openstackId: string;
};

export type TNetwork = {
  id: string;
  name: string;
  vlanId: number;
  type: string;
  status: string;
  regions: TRegion[];
};

export const getAllPrivateNetworks = async (
  projectId: string,
): Promise<TNetwork[]> => {
  const { data } = await v6.get<TNetwork[]>(
    `/cloud/project/${projectId}/network/private`,
  );

  return data;
};

export const getPrivateNetworkName = (
  privateNetworks: TNetwork[],
  privateNetworkId: string,
) => {
  if (!privateNetworkId) {
    return privateNetworkId;
  }

  const result = privateNetworks?.find((network) =>
    network.regions.some((region) => region.openstackId === privateNetworkId),
  );

  return result ? result.name : privateNetworkId;
};
