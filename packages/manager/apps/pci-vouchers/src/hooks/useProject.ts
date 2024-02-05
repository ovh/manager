import { QueryOptions, useQuery } from '@tanstack/react-query';
import { getProject, Project } from '@/data/project';

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
  };
}

export const useProject = (
  projectId: string,
  opt?: QueryOptions<Project, ResponseAPIError>,
) =>
  useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    ...opt,
  });

export default useProject;
