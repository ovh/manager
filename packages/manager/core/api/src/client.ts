import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  redirectToLoginPage,
  redirectToLogoutPage,
} from '@ovh-ux/manager-core-sso';

const defaultAxiosConfig = {};

function handleAuthenticationError(error: AxiosError) {
  const { response } = error;
  let { status } = response;
  const hasCustomCredentials = !!response.config.headers?.Authorization;

  if (status === 403) {
    const message = (response.data as { message: string })?.message;
    if (
      message === 'This session is forbidden' ||
      message === 'This session is invalid'
    ) {
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
v6.interceptors.response.use(null, handleAuthenticationError);

export const aapi = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/2api',
});
aapi.interceptors.response.use(null, handleAuthenticationError);

export const ws = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/ws',
});
ws.interceptors.response.use(null, handleAuthenticationError);

export const v2 = axios.create({
  ...defaultAxiosConfig,
  baseURL: '/engine/api/v2',
});
v2.interceptors.response.use(null, handleAuthenticationError);

export const apiClient = { v6, aapi, ws, v2 };
export type ApiError = AxiosError<{ message: string }>;
export type ApiResponse<T> = AxiosResponse<T>;

export default apiClient;
