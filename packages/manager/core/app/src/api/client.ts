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

export default { v6, aapi, ws };
