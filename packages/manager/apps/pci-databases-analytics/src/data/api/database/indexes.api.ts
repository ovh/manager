import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getIndexes = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.opensearch.Index[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/index`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface DeleteIndex extends ServiceData {
  indexId: string;
}

export const deleteIndex = async ({
  projectId,
  engine,
  serviceId,
  indexId,
}: DeleteIndex) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/index/${indexId}`,
  );
