import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';

async function getNashaServiceInfos({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/dedicated/nasha/${serviceName}/serviceInfos`,
  );
  return response.data;
}

async function getNashaPartition({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/dedicated/nasha/${serviceName}/partitions`,
  );
  return response.data;
}

async function getNashaDetails({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(`/dedicated/nasha/${serviceName}`);
  return response.data;
}

async function getNashaList() {
  const response = await apiClient.v6.get('/dedicated/nasha');
  return response.data;
}

export {
  getNashaDetails,
  getNashaList,
  getNashaPartition,
  getNashaServiceInfos,
};
