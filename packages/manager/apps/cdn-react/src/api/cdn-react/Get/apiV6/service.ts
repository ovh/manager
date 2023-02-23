import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';
import { queryClient } from '@ovh-ux/manager-react-core-application';

export const QUERY_KEY = ['/cdn/dedicated'];

export async function services() {
  const response = await apiClient.v6.get('/cdn/dedicated');
  return response.data;
}
export async function service({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(`/cdn/dedicated/${serviceName}`);
  return response.data;
}

export async function serviceInfos({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/cdn/dedicated/${serviceName}/serviceInfos`,
  );
  return response.data;
}

export async function getSsl({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(`/cdn/dedicated/${serviceName}/ssl`);
  return response.data;
}

export async function getSslTasks({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/cdn/dedicated/${serviceName}/ssl/tasks`,
  );
  return response.data;
}

export async function getDomains({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.get(
    `/cdn/dedicated/${serviceName}/domains`,
  );
  return response.data;
}

export const getCdnReactIds = async (): Promise<string[]> => {
  return queryClient.fetchQuery(QUERY_KEY, services);
};
