import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceDatabases = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.Database[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/database`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface AddDatabase extends ServiceData {
  name: string;
}
export const addDatabase = async ({
  projectId,
  engine,
  serviceId,
  name,
}: AddDatabase) =>
  apiClient.v6.post<database.service.Database>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/database`,
    {
      name,
    },
  );

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
