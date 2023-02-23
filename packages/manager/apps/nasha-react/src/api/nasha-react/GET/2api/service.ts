import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';

async function getNashaDetails({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.aapi.get(`/dedicated/nasha/${serviceName}`);
  return response.data;
}

async function getNashaPartition({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.aapi.get(
    `/dedicated/nasha/${serviceName}/partitions`,
  );
  return response.data;
}

export { getNashaDetails, getNashaPartition };
