import { v6 } from '@ovh-ux/manager-core-api';
import {
  TNetwork,
  NetworkVisibility,
  TNetworkCreationResponse,
  TNetworkCreationParams,
  TNetworkCreationStatusParams,
  TSubnet,
} from '@/types/network.type';

export const getPrivateNetworks = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TNetwork[] }>(
    `/cloud/project/${projectId}/aggregated/network`,
  );

  return data.resources.filter(
    (network) => network.visibility === NetworkVisibility.Private,
  );
};

export const createPrivateNetwork = async ({
  projectId,
  region,
  data: body,
}: TNetworkCreationParams) => {
  const { data } = await v6.post<TNetworkCreationResponse>(
    `/cloud/project/${projectId}/region/${region}/network`,
    body,
  );

  return data;
};

export const checkPrivateNetworkCreationStatus = async ({
  projectId,
  operationId,
}: TNetworkCreationStatusParams) => {
  const { data } = await v6.get<TNetworkCreationResponse>(
    `/cloud/project/${projectId}/operation/${operationId}`,
  );

  return data;
};

export const getSubnets = async (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const { data } = await v6.get<TSubnet[]>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
  );

  return data;
};

export const getNetwork = async (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const { data } = await v6.get<TNetwork>(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}`,
  );

  return data;
};

export const deleteNetwork = async (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}`,
  );

  return data;
};
