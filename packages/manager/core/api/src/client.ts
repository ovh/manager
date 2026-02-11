import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { redirectToLoginPage, redirectToLogoutPage } from '@ovh-ux/manager-core-sso';
import { getHeaders } from '@ovh-ux/request-tagger';

type ApiKey = keyof typeof apiClient;

const defaultAxiosConfig = {};

const getSubscriptionId = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const subscriptionId = (data as { subscriptionId?: unknown }).subscriptionId;
  return typeof subscriptionId === 'string' ? subscriptionId : undefined;
};

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

export const events = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/events',
});

export const apiClient = { v6, aapi, ws, v2, events } as const;

(Object.keys(apiClient) as ApiKey[]).forEach((api) => {
  const client = apiClient[api];

  // if subscriptionId is in the config, add it to the headers
  if (api === 'v6' || api === 'v2') {
    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const subscriptionId = getSubscriptionId(config.data);
      if (subscriptionId) {
        config.headers['X-Subscription-Id'] = subscriptionId;
      }
      return config;
    });
  }
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
