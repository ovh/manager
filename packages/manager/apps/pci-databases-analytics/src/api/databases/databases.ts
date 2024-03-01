import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export const getServiceDatabases = async (
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
) =>
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

export interface AddDatabaseProps {
  projectId: string;
  engine: database.EngineEnum;
  serviceId: string;
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

export interface DeleteDatabaseProps {
  projectId: string;
  engine: database.EngineEnum;
  serviceId: string;
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
