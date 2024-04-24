import { QueryOptions, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getProject, TProject } from '@/api/data/project';

export const getProjectQuery = (projectId: string) => ({
  queryKey: ['project', projectId],
  queryFn: () => getProject(projectId),
});

export const useProject = (
  projectId: string,
  opt?: QueryOptions<TProject, ApiError>,
) =>
  useQuery({
    ...getProjectQuery(projectId),
    ...opt,
  });

export default useProject;
