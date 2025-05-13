import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getIndexes = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get<database.opensearch.Index[]>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/index`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data);

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
