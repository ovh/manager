import { apiClient } from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getCurrentQueries = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  (
    await apiClient.v6.get<{
      queries: database.service.currentqueries.Query[];
    }>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/currentQueries`,
    )
  ).queries;

export interface CancelQuery extends ServiceData {
  pid: number;
  terminate: boolean;
}
export const cancelCurrentQuery = async ({
  projectId,
  engine,
  serviceId,
  pid,
  terminate,
}: CancelQuery) =>
  apiClient.v6.post<database.service.currentqueries.query.CancelResponse>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/currentQueries/cancel`,
    {
      pid,
      terminate,
    },
  );

export type QueryStatistics =
  | database.mysql.querystatistics.Query
  | database.postgresql.querystatistics.Query;
export const getQueryStatistics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  (
    await apiClient.v6.get<{ queries: QueryStatistics[] }>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/queryStatistics`,
    )
  ).queries;

export const resetQueryStatistics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.post(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/queryStatistics/reset`,
  );
