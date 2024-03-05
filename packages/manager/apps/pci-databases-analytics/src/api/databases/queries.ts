import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
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
    .then((res) => res.data as database.service.currentqueries.Query[]);

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
