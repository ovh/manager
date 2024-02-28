import { apiClient } from '@ovh-ux/manager-core-api';
import { PciProject } from '@/models/project';

export const getProject = async (projectId: string): Promise<PciProject> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data as PciProject;
};
