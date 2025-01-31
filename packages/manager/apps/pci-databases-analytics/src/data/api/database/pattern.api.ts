import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getPatterns = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/pattern`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.opensearch.Pattern[]);

export interface AddPattern extends ServiceData {
  pattern: Omit<database.opensearch.Pattern, 'id'>;
}

export const addPattern = async ({
  projectId,
  engine,
  serviceId,
  pattern,
}: AddPattern) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/pattern`,
      pattern,
    )
    .then((res) => res.data as database.opensearch.Pattern);

export interface DeletePattern extends ServiceData {
  patternId: string;
}

export const deletePattern = async ({
  projectId,
  engine,
  serviceId,
  patternId,
}: DeletePattern) =>
  apiClient.v6.delete(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/pattern/${patternId}`,
  );
