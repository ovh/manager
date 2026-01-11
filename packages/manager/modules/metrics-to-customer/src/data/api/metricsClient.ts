import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { redirectToLoginPage, redirectToLogoutPage } from '@ovh-ux/manager-core-sso';
import { getHeaders } from '@ovh-ux/request-tagger';

export interface PrometheusQueryParams {
  query: string;
  start: number | string;
  end: number | string;
  step: number | string;
}

export interface PrometheusResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      values: [number, string][];
    }>;
  };
}

// Create prometheus axios instance similar to v2 client
const metricForManagerClient = axios.create({
  baseURL: 'https://metrics-for-manager.gra.technicalapis.ovh.net/m4m-single-endpoint-proxy/api/v1',
});

// Add request interceptor for headers (same pattern as v2 client)
metricForManagerClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = getHeaders(config.baseURL || '');
  Object.entries(headers).forEach(([key, value]) => {
    (config.headers as Record<string, string>)[key] = value;
  });
  // Ensure cookies are sent with requests (for same-origin, this is automatic)
  config.withCredentials = false;
  return config;
});

// Add response error handler (same pattern as v2 client)
function handleAuthenticationError(error: AxiosError) {
  const { response } = error;
  let { status } = response || {};
  const hasCustomCredentials = !!response?.config?.headers?.Authorization;

  if (status === 403) {
    const message = (response?.data as { message?: string })?.message;
    if (message === 'This session is forbidden' || message === 'This session is invalid') {
      status = 401;
    }
  }

  // redirect to auth page if the api credentials are invalid
  if (status === 401 && !hasCustomCredentials) {
    redirectToLogoutPage();
    return new Promise<never>(() => {}); // never resolve
  }

  // low order session
  if (status === 471) {
    redirectToLoginPage();
    // never resolve since we are redirecting
    return new Promise<never>(() => {});
  }

  return Promise.reject(error);
}

metricForManagerClient.interceptors.response.use(undefined, handleAuthenticationError);

// Export prometheus client similar to apiClient pattern
export const prometheusApiClient = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<{ data: T }> => metricForManagerClient.get<T>(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<{ data: T }> => metricForManagerClient.post<T>(url, data, config),
};

export interface FetchPrometheusDataParams extends PrometheusQueryParams {
  metricToken: string;
  signal?: AbortSignal;
}

export const fetchPrometheusData = async ({
  query,
  start,
  end,
  step,
  metricToken,
  signal,
}: FetchPrometheusDataParams): Promise<PrometheusResult> => {
  
  const { data } = await prometheusApiClient.get<PrometheusResult>(
    '/query_range',
    {
      params: {
        query,
        start,
        end,
        step,
      },
      signal,
      headers: {
        Authorization: `Bearer ${metricToken}`
      }
    },
  );

  return data;
};
