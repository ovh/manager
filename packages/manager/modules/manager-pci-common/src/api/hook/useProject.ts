import { useParams } from 'react-router-dom';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { getProject, TProject } from '../data/project';

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

export const getProjectQuery = (projectId: string) => ({
  queryKey: ['project', projectId],
  queryFn: () => getProject(projectId),
});

export const useProject = (
  projectId?: string,
  options?: QueryOptions<TProject, ResponseAPIError>,
) => {
  const { projectId: defaultProjectId } = useParams();

  return useQuery({
    ...getProjectQuery(projectId || defaultProjectId),
    ...options,
  });
};
