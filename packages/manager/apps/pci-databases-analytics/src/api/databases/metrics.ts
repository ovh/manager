import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
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

interface GetMetricProps extends ServiceData {
  metric: string;
  period: database.service.MetricPeriodEnum;
}
export const getMetric = async ({
  projectId,
  engine,
  serviceId,
  metric,
  period,
}: GetMetricProps) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric/${metric}?period=${period}`,
    )
    .then((res) => res.data as database.service.Metric);
