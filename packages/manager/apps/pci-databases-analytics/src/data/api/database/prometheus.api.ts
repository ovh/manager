import { apiClient } from '@/data/api/api.client';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export type PrometheusData =
  | database.service.PrometheusEndpoint
  | database.mongodb.PrometheusEndpoint;

export const getPrometheus = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<PrometheusData>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/prometheus`,
  );

export const resetPrometheusUserPassword = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.post<database.service.PrometheusAccess>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/prometheus/credentials/reset`,
  );
