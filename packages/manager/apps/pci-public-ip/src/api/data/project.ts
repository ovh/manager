import { v6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export interface Project {
  access: string;
  creationDate: string;
  description: string;
  planCode: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
}

export const getProject = async (projectId: string): Promise<Project> => {
  const { data } = await v6.get<Project>(`/cloud/project/${projectId}`);
  return data;
};

export interface Region {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  status: string;
  type: string;
}

export const getProjectRegions = async (
  projectId: string,
): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export default getProject;
