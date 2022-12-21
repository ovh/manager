import axios, { AxiosError } from 'axios';
import {
  redirectToLoginPage,
  redirectToLogoutPage,
} from '@ovh-ux/manager-core-sso';

const defaultAxiosConfig = {};

function handleAuthenticationError(error: AxiosError) {
  const { response } = error;
  let { status } = response;

  if (status === 403) {
    const message = (response.data as {
      message: string;
    })?.message;
    if (
      message === 'This session is forbidden' ||
      message === 'This session is invalid'
    ) {
      status = 401;
    }
  }
  if (status === 401) {
    redirectToLogoutPage();
    return new Promise(() => {});
  }
  if (status === 471) {
    redirectToLoginPage();
    return new Promise(() => {});
  }
  return error;
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
  baseURL: '/engine/2.0',
});
v2.interceptors.response.use(null, handleAuthenticationError);

export const apiClient = { v6, aapi, ws, v2 };

export default apiClient;
