import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { redirectToLoginPage, redirectToLogoutPage } from '@ovh-ux/manager-core-sso';
import { getHeaders } from '@ovh-ux/request-tagger';

type ApiKey = keyof typeof apiClient;

const defaultAxiosConfig = {};

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

export const v6 = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/apiv6',
});

export const aapi = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/2api',
});

export const ws = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/ws',
});

export const v2 = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/api/v2',
});

export const apiClient = { v6, aapi, ws, v2 } as const;

(Object.keys(apiClient) as ApiKey[]).forEach((api) => {
  const client = apiClient[api];

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const headers = getHeaders(config.baseURL || '');
    Object.entries(headers).forEach(([key, value]) => {
      (config.headers as Record<string, string>)[key] = value;
    });
    return config;
  });

  client.interceptors.response.use(undefined, handleAuthenticationError);
});

export default apiClient;
