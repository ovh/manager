import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getMetrics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric?extended=false`,
    )
    .then((res) => res.data as string[]);

interface GetMetric extends ServiceData {
  metric: string;
  period: database.service.MetricPeriodEnum;
}
export const getMetric = async ({
  projectId,
  engine,
  serviceId,
  metric,
  period,
}: GetMetric) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric/${metric}?period=${period}`,
    )
    .then((res) => res.data as database.service.Metric);
