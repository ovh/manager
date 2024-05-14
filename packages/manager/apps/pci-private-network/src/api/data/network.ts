import { v6 } from '@ovh-ux/manager-core-api';
import { TSubnet } from './subnets';

export type TAggregatedNetwork = {
  id: string;
  name: string;
  region: string;
  visibility: string;
  vlanId: number;
  subnets: TSubnet[];
  search?: string;
};

export type TNetworkCreationResponse = {
  action: 'network#create';
  completedAt: string | null;
  createdAt: string;
  id: string;
  progress: number;
  regions: string[];
  resourceId: string | null;
  startedAt: string | null;
  status: 'completed' | 'created' | 'in-error' | 'in-progress' | 'unknown';
  subOperations;
};

export const getAggregatedNetwork = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TAggregatedNetwork[] }>(
    `/cloud/project/${projectId}/aggregated/network`,
  );

  return data.resources;
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
export const associateGatewayToNetworkCall = async (
  projectId: string,
  region: string,
  gatewayId: string,
  subnetId: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/interface`,
    {
      subnetId,
    },
  );

  return data;
};

export const enableSnatOnGatewayCall = async (
  projectId: string,
  region: string,
  gatewayId: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/expose`,
  );

  return data;
};

export const getCreatedSubnet = async (
  projectId: string,
  region: string,
  networkId: string,
) => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/region/${region}/network/${networkId}/subnet`,
  );

  return data;
};

export const checkPrivateNetworkCreationStatus = async (
  projectId: string,
  operationId: string,
) => {
  const { data } = await v6.get<TNetworkCreationResponse>(
    `/cloud/project/${projectId}/operation/${operationId}`,
  );

  return data;
};

export const createNetworkCall = async (
  projectId: string,
  region: string,
  privateNetworkName: string,
  subnet,
  gateway,
  vlanId = null,
) => {
  const { data } = await v6.post<TNetworkCreationResponse>(
    `/cloud/project/${projectId}/region/${region}/network`,
    {
      name: privateNetworkName,
      subnet,
      ...(gateway && { gateway }),
      ...(typeof vlanId === 'number' && { vlanId }),
    },
  );

  return data;
};

const waitForNetworkCreation = async (projectId: string, networkId: string) => {
  const waitFor = (ms = 1000) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const response: TNetworkCreationResponse = await checkPrivateNetworkCreationStatus(
    projectId,
    networkId,
  );

  if (response.status === 'in-error') {
    return Promise.reject(response);
  }

  if (response.status !== 'completed') {
    return waitFor(1000).then(() =>
      waitForNetworkCreation(projectId, networkId),
    );
  }

  return Promise.resolve(response);
};

export const createNetwork = async ({
  projectId,
  region,
  privateNetworkName,
  subnet,
  vlanId = null,
  gateway,
}: {
  projectId: string;
  region: string;
  privateNetworkName: string;
  subnet: {
    cidr: string;
    ipVersion: number;
    enableDhcp: boolean;
    enableGatewayIp: boolean;
  };
  vlanId: number | null;
  gateway?: {
    gatewayName: string;
    gatewaySize: string;
  };
}) => {
  const networkCreationResponse: TNetworkCreationResponse = await createNetworkCall(
    projectId,
    region,
    privateNetworkName,
    subnet,
    gateway,
    vlanId,
  );

  const statusResponse: TNetworkCreationResponse = await waitForNetworkCreation(
    projectId,
    networkCreationResponse.id,
  );

  const subnetResponse: TSubnet[] = await getCreatedSubnet(
    projectId,
    region,
    statusResponse.resourceId,
  );

  return subnetResponse;
};
