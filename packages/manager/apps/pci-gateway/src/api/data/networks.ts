import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';

export type TNetwork = {
  id: string;
  name: string;
  visibility: 'private' | 'public';
};

export type TNewNetworkWithGateway = {
  name: string;
  subnet: {
    cidr: string;
    ipVersion: number;
    enableDhcp: boolean;
    enableGatewayIp: boolean;
  };
  gateway: {
    name: string;
    model: string;
  };
};

export const getNetworksUrl = (projectId: string, regionName: string) =>
  `/cloud/project/${projectId}/region/${regionName}/network`;

export const getNetworks = async (
  projectId: string,
  regionName: string,
): Promise<TNetwork[]> => {
  const { data } = await v6.get<TNetwork[]>(
    getNetworksUrl(projectId, regionName),
  );
  return data;
};

export const getPrivateNetworks = async (
  projectId: string,
  regionName: string,
): Promise<TNetwork[]> => {
  const networks = await getNetworks(projectId, regionName);
  return networks.filter((network) => network.visibility === 'private');
};

export const createNetworkWithGateway = async (
  projectId: string,
  regionName: string,
  newNetwork: TNewNetworkWithGateway,
) => {
  const url = `/cloud/project/${projectId}/region/${regionName}/network`;

  try {
    const { data } = await v6.post(url, newNetwork);
    return data;
  } catch (e) {
    const error = e as AxiosError;
    throw new Error((error.response.data as { message: string })?.message);
  }
};
