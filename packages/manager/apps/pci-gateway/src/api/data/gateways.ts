import { v6 } from '@ovh-ux/manager-core-api';

export type TGateway = {
  id: string;
  name: string;
  model: string;
};

export const getGatewayUrl = (
  projectId: string,
  regionName: string,
  gatewayId: string,
) => `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`;

export const getGateway = async (
  projectId: string,
  regionName: string,
  gatewayId: string,
): Promise<TGateway> => {
  const { data } = await v6.get<TGateway>(
    getGatewayUrl(projectId, regionName, gatewayId),
  );
  return data;
};

export const updateGateway = async (
  projectId: string,
  regionName: string,
  gatewayId: string,
  name: string,
  model: string,
) => {
  const url = `/cloud/project/${projectId}/region/${regionName}/gateway/${gatewayId}`;
  const payload = {
    model,
    name,
  };

  const { data } = await v6.put(url, payload);

  return data;
};
