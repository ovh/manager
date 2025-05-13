import { useQuery } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getProject } from '@/data/api/database/project.api';

export function useGetProject(projectId: string) {
  const queryKey = ['project', projectId];

  return useQuery<database.project.ProjectData, Error>({
    queryKey,
    queryFn: () => getProject(projectId),
  });
}
