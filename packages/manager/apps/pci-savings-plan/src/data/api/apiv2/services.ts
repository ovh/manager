import { apiClient } from '@ovh-ux/manager-core-api';
import { PciProject } from '@/data/api/api.type';

export const getProject = async (projectId: string): Promise<PciProject> => {
  const response = await apiClient.v6.get(`/cloud/project/${projectId}`);
  return response.data;
};
