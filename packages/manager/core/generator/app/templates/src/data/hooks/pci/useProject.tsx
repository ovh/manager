import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';

export interface PciProject {
  description: string;
  project_id: string;
  status: string;
  planCode: string;
  access: string;
  projectName: string;
}

export function useProject({ projectId }: { projectId: string }) {
  const [project, setProject] = useState({});
  const getProject = () => apiClient.v6.get(`/cloud/project/${projectId}`);

  const { data, isError, isLoading, status } = useQuery<
    AxiosResponse<PciProject>
  >({
    queryKey: [`pci-project-${projectId}`],
    queryFn: getProject,
    retry: 3,
  });

  useEffect(() => {
    if (status === 'success') {
      setProject(data.data);
    }
  }, [data]);

  return {
    project,
    isError,
    isLoading,
  };
}

export default useProject;
