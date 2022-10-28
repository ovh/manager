import axios from 'axios';

export enum ApiClientVersions {
  v6 = 'v6',
  v2 = 'v2',
}

const defaultAxiosConfig = {};

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
  baseURL: '/engine/v2',
});

export const apiClient = { v6, aapi, ws, v2 };

export default apiClient;
