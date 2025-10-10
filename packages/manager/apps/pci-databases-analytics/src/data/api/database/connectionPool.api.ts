import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getConnectionPools = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.postgresql.ConnectionPool[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface AddConnectionPool extends ServiceData {
  connectionPool: Partial<database.postgresql.ConnectionPoolCreation>;
}

export const addConnectionPool = async ({
  projectId,
  engine,
  serviceId,
  connectionPool,
}: AddConnectionPool) =>
  apiClient.v6.post<database.postgresql.ConnectionPool>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool`,
    connectionPool,
  );

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
  return apiClient.v6.put<database.postgresql.ConnectionPool>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/connectionPool/${id}`,
    body,
  );
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
