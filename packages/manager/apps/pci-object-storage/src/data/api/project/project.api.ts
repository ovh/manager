import { Project } from '@datatr-ux/ovhcloud-types/cloud/Project';
import { apiClient } from '@/data/api/api.client';

export const getProject = async (projectId: string): Promise<Project> =>
  apiClient.v6.get<Project>(`/cloud/project/${projectId}`);
