import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getProjectsWithServices,
  projectsWithServiceQueryKey,
} from '@/data/api/projects-with-services';
import { TProjectWithService } from '@/data/types/project.type';

type TActiveProjectsReturn = {
  activeProjects: TProjectWithService[];
  isReady: boolean;
};

/**
 * Hook that fetches and filters active projects with 'ok' status.
 *
 * @returns An object containing:
 *   - `activeProjects`: Array of projects with status 'ok'
 *   - `isReady`: Boolean indicating if the data is ready (not loading and no error)
 */
export default (): TActiveProjectsReturn => {
  const { data, isError, isLoading } = useQuery({
    queryKey: [projectsWithServiceQueryKey()],
    queryFn: getProjectsWithServices,
  });

  const activeProjects = useMemo(
    () =>
      (data?.data || []).filter(
        (project: TProjectWithService) => project.status === 'ok',
      ),
    [data],
  );

  return { activeProjects, isReady: !isError && !isLoading };
};
