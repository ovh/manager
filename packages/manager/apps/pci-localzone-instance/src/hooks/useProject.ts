import { QueryOptions, useQuery } from '@tanstack/react-query';
import { Project, getProject } from '@/data/project';

export const useProject = (projectId: string, opt?: QueryOptions<Project>) =>
  useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    ...opt,
  });

export default useProject;
