import { QueryOptions, useQuery } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

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

const getProject = async (projectId: string): Promise<Project> => {
  const { data } = await v6.get<Project>(`/cloud/project/${projectId}`);
  return data;
};

export const getProjectQuery = (projectId: string) => ({
  queryKey: ['project', projectId],
  queryFn: () => getProject(projectId),
});

export const useProject = (projectId: string, opt?: QueryOptions<Project>) =>
  useQuery({
    ...getProjectQuery(projectId),
    ...opt,
  });

export default useProject;
