import { useQuery } from '@tanstack/react-query';
import {
  getCloudProjectService,
  getCloudProjectServiceQueryKey,
} from '@/data/api/project';

export const useProject = (projectId: string | undefined) => {
  const { data: project, ...rest } = useQuery({
    queryKey: getCloudProjectServiceQueryKey({ serviceName: projectId }),
    queryFn: () => getCloudProjectService(projectId as string),
    enabled: !!projectId,
    select: (p) => p.data,
  });
  return { project, ...rest };
};
