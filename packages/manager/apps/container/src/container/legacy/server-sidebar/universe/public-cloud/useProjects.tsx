import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

export interface PciProject {
  description: string;
  project_id: string;
  status: string;
  planCode: string;
}

export function useProjects() {
  const location = useLocation();

  const getProjects = (): Promise<PciProject[]> =>
    v6.get('/cloud/project', {
      headers: {
        'X-Pagination-Filter': 'status:in=creating,ok,suspended',
        'X-Pagination-Mode': 'CachedObjectList-Cursor',
        'X-Pagination-Sort': 'description',
        'X-Pagination-Sort-Order': 'ASC',
        'Pragma': 'no-cache',
      },
    }).then(({ data }) => data);

  const { data: projects, isError, isLoading } = useQuery({
    queryKey: [`pci-projects`],
    queryFn: getProjects,
    retry: 3,
  });
  const [currentProject, setCurrentProject] = useState<PciProject>(null);

  useEffect(() => {
    const projectId = (location?.pathname?.match(/\/pci\/projects\/([^/]+)/) ||
      [])[1];
    setCurrentProject(
      (projects || []).find((project) => project.project_id === projectId),
    );
  }, [projects, location]);

  return {
    currentProject,
    projects,
    isError,
    isLoading,
  };
}

export default useProjects;
