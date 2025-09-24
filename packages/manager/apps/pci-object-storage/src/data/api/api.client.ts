import { apiClient as coreApiClient } from '@ovh-ux/manager-core-api';

type ClientVersion = 'v2' | 'v6' | 'aapi' | 'ws';
type CoreClient = typeof coreApiClient['v2'];
type RequestConfig = Parameters<CoreClient['get']>[1];

const createClient = (version: ClientVersion) => {
  const client = coreApiClient[version];

  return {
    get: async <T>(url: string, config?: RequestConfig): Promise<T> => {
      const { data } = await client.get<T>(url, config);
      return data;
    },
    delete: async <T>(url: string, config?: RequestConfig): Promise<T> => {
      const { data } = await client.delete<T>(url, config);
      return data;
    },
    post: async <T, B = unknown>(
      url: string,
      body?: B,
      config?: RequestConfig,
    ): Promise<T> => {
      const { data } = await client.post<T>(url, body, config);
      return data;
    },
    put: async <T, B = unknown>(
      url: string,
      body?: B,
      config?: RequestConfig,
    ): Promise<T> => {
      const { data } = await client.put<T>(url, body, config);
      return data;
    },
  };
};

export const apiClient = {
  v2: createClient('v2'),
  v6: createClient('v6'),
  aapi: createClient('aapi'),
  ws: createClient('ws'),
};

export const NoCacheHeaders = {
  Pragma: 'no-cache',
};
export const IcebergPaginationHeaders = {
  'X-Pagination-Mode': 'CachedObjectList-Pages',
  'X-Pagination-Size': '50000',
};

export function createHeaders(
  ...headers: Record<string, string>[]
): Record<string, string> {
  return Object.assign({}, ...headers);
}
