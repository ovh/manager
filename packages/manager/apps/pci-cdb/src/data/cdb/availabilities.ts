import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export const getAvailabilities = async (
  projectId: string,
  status: database.availability.StatusEnum[] = [
    database.availability.StatusEnum.STABLE,
    database.availability.StatusEnum.BETA,
  ],
) => {
  const headers: Record<string, string> = {
    'X-Pagination-Mode': 'CachedObjectList-Pages',
    'X-Pagination-Size': '50000',
  };
  if (status.length > 0) {
    headers['X-Pagination-Filter'] =
      status.length === 1
        ? `lifecycle.status:eq=${status[0]}`
        : `lifecycle.status:in=${status.join(',')}`;
  }
  return apiClient.v6
    .get(`/cloud/project/${projectId}/database/availability`, {
      headers,
    })
    .then((res) => res.data as database.Availability[]);
};
export const getCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities`)
    .then((res) => res.data as database.Capabilities);
