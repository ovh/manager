import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  region: string;
  status: string;
  openstackId: string;
};

export type TNetworkRegion = {
  id: string;
  name: string;
  visibility: string;
  vlanId: number;
};

export type TNetwork = {
  id: string;
  name: string;
  vlanId: number;
  type: string;
  status: string;
  regions: TRegion[];
  clusterRegion?: TNetworkRegion;
};

export const getAllPrivateNetworks = async (projectId: string): Promise<TNetwork[]> => {
  const { data } = await v6.get<TNetwork[]>(`/cloud/project/${projectId}/network/private`);

  return data;
};

export const getPrivateNetworkName = (privateNetworks: TNetwork[], privateNetworkId: string) => {
  if (!privateNetworkId) {
    return privateNetworkId;
  }

  const result = privateNetworks?.find((network) =>
    network.regions.some((region) => region.openstackId === privateNetworkId),
  );

  return result ? result.name : privateNetworkId;
};

export const getAllPrivateNetworksByRegion = async (projectId: string, regionName: string) => {
  const { data } = await v6.get<TNetworkRegion[]>(
    `/cloud/project/${projectId}/region/${regionName}/network`,
  );

  return data;
};
