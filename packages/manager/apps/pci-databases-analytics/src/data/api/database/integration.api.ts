import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceIntegrations = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.service.Integration[]);

export const getServiceCapabilitiesIntegrations = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/capabilities/integration`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.capabilities.Integration[]);

export interface AddIntegration extends ServiceData {
  integration: Omit<database.service.Integration, 'id' | 'status'>;
}
export const addIntegration = async ({
  projectId,
  engine,
  serviceId,
  integration,
}: AddIntegration) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration`,
      integration,
    )
    .then((res) => res.data as database.service.Integration);

export interface DeleteIntegration extends ServiceData {
  integrationId: string;
}
export const deleteIntegration = async ({
  integrationId,
  engine,
  projectId,
  serviceId,
}: DeleteIntegration) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/integration/${integrationId}`,
  );
