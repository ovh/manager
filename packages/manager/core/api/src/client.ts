import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { redirectToLoginPage, redirectToLogoutPage } from '@ovh-ux/manager-core-sso';
import { getHeaders } from '@ovh-ux/request-tagger';

const defaultAxiosConfig = {};

function handleAuthenticationError(error: AxiosError) {
  const { response } = error;
  let { status } = response;
  const hasCustomCredentials = !!response.config.headers?.Authorization;

  if (status === 403) {
    const message = (response.data as { message: string })?.message;
    if (message === 'This session is forbidden' || message === 'This session is invalid') {
      status = 401;
    }
  }

  // redirect to auth page if the api credentials are invalid
  if (status === 401 && !hasCustomCredentials) {
    redirectToLogoutPage();
    // never resolve since we are redirecting
    return new Promise(() => {});
  }

  // low order session
  if (status === 471) {
    redirectToLoginPage();
    // never resolve since we are redirecting
    return new Promise(() => {});
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

export const apiClient: Record<string, AxiosInstance> = { v6, aapi, ws, v2 };

Object.keys(apiClient).forEach((api) => {
  apiClient[api]?.interceptors?.request.use((config) => {
    const headers = getHeaders(config?.baseURL);
    Object.keys(headers).forEach((header) => {
      config.headers.set(header, headers[header]);
      return header;
    });
    return {
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    } as InternalAxiosRequestConfig<any>;
  });
  // Handle all response with authentification error
  apiClient[api]?.interceptors?.response.use(null, handleAuthenticationError);
  return api;
});

export type ApiError = AxiosError<{ message: string }>;
export type ApiResponse<T> = AxiosResponse<T>;

export default apiClient;
