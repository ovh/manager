import { apiClient } from '@ovh-ux/manager-core-api';
import QueryString from 'qs';
import { database } from '@/models/database';
import { PCIData } from '.';

interface GetAvailabilitiesProps extends PCIData {
  status?: database.availability.StatusEnum[];
  serviceId?: string;
  action?: database.availability.ActionEnum;
  target?: database.availability.TargetEnum;
}
export const getAvailabilities = async ({
  projectId,
  status = [
    database.availability.StatusEnum.STABLE,
    database.availability.StatusEnum.BETA,
  ],
  serviceId,
  action,
  target,
}: GetAvailabilitiesProps) => {
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
  const queryParams: Record<string, string> = {};
  if (serviceId) queryParams.clusterId = serviceId;
  if (action) queryParams.action = action;
  if (target) queryParams.target = target;
  const queryString = QueryString.stringify(queryParams, {
    addQueryPrefix: true,
  });
  return apiClient.v6
    .get(`/cloud/project/${projectId}/database/availability${queryString}`, {
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
