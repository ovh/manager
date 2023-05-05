import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';
import ServiceInfos from './types';

async function services() {
  const response = await apiClient.v6.get('/dedicated/nasha');
  return response.data;
}

async function serviceV6({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(`/dedicated/nasha/${serviceName}`);
  return response.data;
}

async function serviceInfos({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/dedicated/nasha/${serviceName}/serviceInfos`,
  );

  return response.data as ServiceInfos;
}

async function getPartition({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/dedicated/nasha/${serviceName}/partitions`,
  );
  return response.data;
}

export { serviceV6, services, getPartition, serviceInfos };
