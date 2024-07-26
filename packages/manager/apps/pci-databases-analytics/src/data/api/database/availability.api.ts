import { apiClient } from '@ovh-ux/manager-core-api';
import QueryString from 'qs';
import * as database from '@/types/cloud/project/database';
import { PCIData } from '.';

interface GetAvailabilities extends PCIData {
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
}: GetAvailabilities) => {
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
  if (action) {
    queryParams.action = action;
    headers.Pragma = 'no-cache';
  }
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
    .then((res) => res.data as database.availability.Suggestion[]);
