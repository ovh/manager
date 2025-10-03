import { apiClient } from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getMetrics = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<string[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric?extended=false`,
  );

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
  apiClient.v6.get<database.service.Metric>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric/${metric}?period=${period}`,
  );
