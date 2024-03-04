import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
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

export interface AddDatabaseProps extends ServiceData {
  name: string;
}
export const addDatabase = async ({
  projectId,
  engine,
  serviceId,
  name,
}: AddDatabaseProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/database`,
      {
        name,
      },
    )
    .then((res) => res.data as database.service.Database);

export interface DeleteDatabaseProps extends ServiceData {
  databaseId: string;
}
export const deleteDatabase = async ({
  databaseId,
  engine,
  projectId,
  serviceId,
}: DeleteDatabaseProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/database/${databaseId}`,
  );
