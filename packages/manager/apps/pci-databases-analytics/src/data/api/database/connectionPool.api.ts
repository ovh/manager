import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

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

export interface AddConnectionPool extends ServiceData {
  connectionPool: Partial<database.postgresql.ConnectionPoolCreation>;
}

export const addConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPool,
}: AddConnectionPool) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool`,
      connectionPool,
    )
    .then((res) => res.data as database.postgresql.ConnectionPool);

export type ConnectionPoolEdition = Omit<
  database.postgresql.ConnectionPool,
  'name' | 'port' | 'uri'
>;

export interface EditConnectionPool extends ServiceData {
  connectionPool: ConnectionPoolEdition;
}

export const editConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPool,
}: EditConnectionPool) => {
  const { id, ...body } = connectionPool;
  return apiClient.v6
    .put(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool/${id}`,
      body,
    )
    .then((res) => res.data as database.postgresql.ConnectionPool);
};

export interface DeleteConnectionPool extends ServiceData {
  connectionPoolId: string;
}
export const deleteConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPoolId,
}: DeleteConnectionPool) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool/${connectionPoolId}`,
  );
