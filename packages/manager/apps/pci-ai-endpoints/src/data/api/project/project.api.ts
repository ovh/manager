import { apiClient } from '@ovh-ux/manager-core-api';
import { Project } from '@/types/cloud/Project';

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data as Project;
};
