import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';

async function service({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.aapi.get(`/dedicated/nasha/${serviceName}`);
  return response.data;
}

async function getPartition({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.aapi.get(
    `/dedicated/nasha/${serviceName}/partitions`,
  );
  return response.data;
}

export { service, getPartition };
