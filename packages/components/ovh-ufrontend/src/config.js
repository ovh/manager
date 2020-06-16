import { fetchConfig as fetchDevConfig } from './development';

const isDevelopment = ['localhost', '127.0.0.1'].includes(
  window.location.hostname,
);

function fetchConfig(config) {
  return isDevelopment ? fetchDevConfig(config) : undefined;
}

export default fetchConfig;
export { fetchConfig };
