import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceDatabases = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/database`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.service.Database[]);

export interface AddDatabase extends ServiceData {
  name: string;
}
export const addDatabase = async ({
  projectId,
  engine,
  serviceId,
  name,
}: AddDatabase) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/database`,
      {
        name,
      },
    )
    .then((res) => res.data as database.service.Database);

export interface DeleteDatabase extends ServiceData {
  databaseId: string;
}
export const deleteDatabase = async ({
  databaseId,
  engine,
  projectId,
  serviceId,
}: DeleteDatabase) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/database/${databaseId}`,
  );
