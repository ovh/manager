import axios from 'axios';

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
  baseURL: '/engine/2.0',
});

export const apiClient = { v6, aapi, ws, v2 };

export default apiClient;
