import { v6 } from '@ovh-ux/manager-core-api';

interface PCIEndpoints {
  projectId: string;
  startTime: string;
  endTime: string;
}

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
