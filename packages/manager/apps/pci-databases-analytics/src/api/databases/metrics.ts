import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export const getMetrics = async (
  projectId: string,
  engine: string,
  serviceId: string,
) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric?extended=false`,
    )
    .then((res) => res.data as string[]);

export const getMetric = async (
  projectId: string,
  engine: string,
  serviceId: string,
  metric: string,
  period: database.service.MetricPeriodEnum,
) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric/${metric}?period=${period}`,
    )
    .then((res) => res.data as database.service.Metric);
