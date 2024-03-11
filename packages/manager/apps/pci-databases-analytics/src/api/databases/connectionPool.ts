import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
import { ServiceData } from '.';

export interface ConnectionPoolWithData
  extends database.postgresql.ConnectionPool {
  databaseName: string;
  userName: string;
}

export const getConnectionPools = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.postgresql.ConnectionPool[]);

export interface AddConnectionPoolProps extends ServiceData {
  connectionPool: database.postgresql.ConnectionPoolCreation;
}

export const addConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPool,
}: AddConnectionPoolProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool`,
      connectionPool,
    )
    .then((res) => res.data as database.postgresql.ConnectionPool);

export interface ConnectionPoolEdition {
  databaseId: string;
  mode: database.postgresql.connectionpool.ModeEnum;
  size: number;
  userId?: string;
}

export interface EditConnectionPoolProps extends ServiceData {
  connectionPoolId: string;
  connectionPool: ConnectionPoolEdition;
}

export const editConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPoolId,
  connectionPool,
}: EditConnectionPoolProps) =>
  apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool/${connectionPoolId}`,
      connectionPool,
    )
    .then((res) => res.data as database.postgresql.ConnectionPool);

export interface DeleteConnectionPoolProps extends ServiceData {
  connectionPoolId: string;
}
export const deleteConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPoolId,
}: DeleteConnectionPoolProps) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool/${connectionPoolId}`,
  );
