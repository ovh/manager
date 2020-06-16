import { fetchConfig as fetchDevConfig } from './development';
import { fetchConfig as fetchProdConfig } from './production';

const isDevelopment = ['localhost', '127.0.0.1'].includes(
  window.location.hostname,
);

function fetchConfig(config) {
  return isDevelopment ? fetchDevConfig(config) : fetchProdConfig(config);
}

export default fetchConfig;
export { fetchConfig };
