import { v6 } from '@ovh-ux/manager-core-api';

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
  const { data } = await v6.get(`/cloud/project/${projectId}`);

  return data as Project;
};

export default getProject;
