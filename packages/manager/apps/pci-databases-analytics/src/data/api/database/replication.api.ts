import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

const icebergHeaders = {
  'X-Pagination-Mode': 'CachedObjectList-Pages',
  'X-Pagination-Size': '50000',
  Pragma: 'no-cache',
};

export const getReplications = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get<database.service.Replication[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication`,
      {
        headers: icebergHeaders,
      },
    )
    .then((res) => res.data);

export interface IAddReplication extends ServiceData {
  replication: Omit<database.service.Replication, 'id'>;
}
export const addReplication = async ({
  projectId,
  engine,
  serviceId,
  replication,
}: IAddReplication) =>
  apiClient.v6
    .post<database.service.Replication>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication`,
      {
        ...replication,
      },
    )
    .then((res) => res.data);

export interface IEditReplication extends ServiceData {
  replication: database.service.Replication;
}
export const editReplication = async ({
  projectId,
  engine,
  serviceId,
  replication,
}: IEditReplication) => {
  const {
    id,
    sourceIntegration,
    targetIntegration,
    ...replicationWithoutId
  } = replication;
  return apiClient.v6
    .put<database.service.Replication>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/replication/${id}`,
      {
        ...replicationWithoutId,
      },
    )
    .then((res) => res.data);
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
