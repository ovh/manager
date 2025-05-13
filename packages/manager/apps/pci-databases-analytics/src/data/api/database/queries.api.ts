import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getCurrentQueries = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/currentQueries`,
    )
    .then((res) => res.data.queries as database.service.currentqueries.Query[]);

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
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/currentQueries/cancel`,
      {
        pid,
        terminate,
      },
    )
    .then(
      (res) => res.data as database.service.currentqueries.query.CancelResponse,
    );

export type QueryStatistics =
  | database.mysql.querystatistics.Query
  | database.postgresql.querystatistics.Query;
export const getQueryStatistics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/queryStatistics`,
    )
    .then((res) => res.data.queries as QueryStatistics[]);

export const resetQueryStatistics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/queryStatistics/reset`,
    )
    .then((res) => res.data);
