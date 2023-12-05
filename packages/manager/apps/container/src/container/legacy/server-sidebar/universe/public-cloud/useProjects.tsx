import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PciProject, getPciProjects } from '@/container/common/utils'

export function useProjects() {
  const location = useLocation();

  const { data: projects, isError, isLoading } = useQuery({
    queryKey: [`pci-projects`],
    queryFn: getPciProjects,
    retry: 3,
  });
  const [currentProject, setCurrentProject] = useState<PciProject>(null);
  const [shouldSeeAllProjects, setShouldSeeAllProjects] = useState<boolean>(false);

  useEffect(() => {
    const projectId = (location?.pathname?.match(/\/pci\/projects\/([^/]+)/) ||
      [])[1];
    setCurrentProject(
      (projects || []).find((project) => project.project_id === projectId),
    );
    setShouldSeeAllProjects(
      !(projects || []).find(({ planCode, status }) =>
        planCode === 'project.discovery' && status === 'ok'),
    )
  }, [projects, location]);

  return {
    currentProject,
    projects,
    isError,
    isLoading,
    shouldSeeAllProjects,
  };
}

export default useProjects;
