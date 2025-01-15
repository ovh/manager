import { apiClient } from '@ovh-ux/manager-core-api';
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
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/prometheus`,
    )
    .then((res) => res.data as PrometheusData);

export const resetPrometheusUserPassword = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/prometheus/credentials/reset`,
    )
    .then((res) => res.data as database.service.PrometheusAccess);
