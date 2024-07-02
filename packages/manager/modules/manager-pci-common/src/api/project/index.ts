import { v6 } from '@ovh-ux/manager-core-api';
import { TProject } from './project.type';

export const getProject = async (projectId: string): Promise<TProject> => {
  const { data } = await v6.get(`/cloud/project/${projectId}`);
  return data;
};

export default getProject;
