import { apiClient } from '@/data/api/api.client';
import { Project } from '@/types/cloud/Project';

export const getProject = async (projectId: string): Promise<Project> =>
  apiClient.v6.get<Project>(`/cloud/project/${projectId}`);
