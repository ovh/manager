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

export const getSuggestions = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/availability/suggestion`)
    .then((res) => res.data as database.Suggestion[]);

export const getCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities`)
    .then((res) => res.data as database.Capabilities);

export const getEnginesCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities/engines`)
    .then((res) => res.data as database.EngineCapabilities[]);

export const getRegionsCapabilities = async (projectId: string) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/capabilities/regions`)
    .then((res) => res.data as database.RegionCapabilities[]);
