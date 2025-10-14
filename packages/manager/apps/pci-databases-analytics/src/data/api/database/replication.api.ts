import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';
import { omit } from '@/lib/omit';

export const getReplications = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.Replication[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication`,
    createHeaders(NoCacheHeaders, IcebergPaginationHeaders),
  );

export interface IAddReplication extends ServiceData {
  replication: Omit<database.service.Replication, 'id'>;
}
export const addReplication = async ({
  projectId,
  engine,
  serviceId,
  replication,
}: IAddReplication) =>
  apiClient.v6.post<database.service.Replication>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication`,
    replication,
  );

export interface IEditReplication extends ServiceData {
  replication: database.service.Replication;
}
export const editReplication = async ({
  projectId,
  engine,
  serviceId,
  replication,
}: IEditReplication) => {
  const { id } = replication;
  const replicationWithoutId = omit(replication, [
    'sourceIntegration',
    'targetIntegration',
  ]);
  return apiClient.v6.put<database.service.Replication>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication/${id}`,
    replicationWithoutId,
  );
};

export interface IDeleteReplication extends ServiceData {
  replicationId: string;
}
export const deleteReplication = async ({
  projectId,
  engine,
  serviceId,
  replicationId,
}: IDeleteReplication) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication/${replicationId}`,
  );
