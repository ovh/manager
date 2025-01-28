import { v6 } from '@ovh-ux/manager-core-api';
import { PCIEndpoints } from './index';

export const getMetrics = async ({
  projectId,
  startTime,
  endTime,
}: PCIEndpoints) => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/ai/endpoints/metrics?startTime=${startTime}&endTime=${endTime}`,
  );
  return data;
};

interface GetMetric extends PCIEndpoints {
  metric: string;
}

export const getMetric = async ({
  projectId,
  metric,
  startTime,
  endTime,
}: GetMetric) => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/ai/endpoints/metrics/${metric}?startTime=${startTime}&endTime=${endTime}`,
  );
  return data;
};
