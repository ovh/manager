import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

export type TProject = {
  access: string;
  creationDate: string;
  description: string;
  planCode: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
};

export const getProject = async (projectId: string): Promise<TProject> => {
  const { data } = await v6.get<TProject>(`/cloud/project/${projectId}`);
  return data;
};

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

export default getProject;
