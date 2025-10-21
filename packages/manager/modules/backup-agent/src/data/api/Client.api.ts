import type { AxiosInstance } from 'axios';

import { v2 as httpV2, v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { ApiVersion, JsonRequestOptions } from '@/types/ClientApi.type';

const API_CLIENTS: Record<ApiVersion, AxiosInstance> = {
  v2: httpV2,
  v6: httpV6,
};

export function getApiClient(version: ApiVersion): AxiosInstance {
  return API_CLIENTS[version];
}

export async function getJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.get<T>(route, { params: options.params, headers });
  return data;
}

export async function postJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.post<T>(route, body, { params: options.params, headers });
  return data;
}

export async function putJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.put<T>(route, body, { params: options.params, headers });
  return data;
}

export async function deleteJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.delete<T>(route, { params: options.params, headers });
  return data;
}
