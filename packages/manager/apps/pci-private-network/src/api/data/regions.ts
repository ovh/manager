import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export type TGateway = {
  id: string;
  model: string;
  name: string;
  region: string;
  status: string;
  interfaces: {
    id: string;
    ip: string;
    networkId: string;
    subnetId: string;
  }[];
};

export const getGateways = async (projectId: string) => {
  const { data } = await v6.get<{ resources: TGateway[] }>(
    `/cloud/project/${projectId}/aggregated/gateway`,
  );

  return data?.resources;
};
