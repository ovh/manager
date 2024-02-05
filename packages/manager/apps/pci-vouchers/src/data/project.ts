import { v6 } from '@ovh-ux/manager-core-api';

export interface Project {
  access: string;
  creationDate: string;
  description: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
}

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await v6.get(`/cloud/project/${projectId}`);
  return response.data as Project;
};

export default getProject;
