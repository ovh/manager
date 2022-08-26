import axios from 'axios';

export enum RequestTypesEnum {
  APIV6 = 'apiv6',
  AAPI = 'aapi',
  WS = 'ws',
  NONE = 'none',
}

const urlPrefixes = {
  apiv6: '/engine/apiv6',
  aapi: '/engine/2api',
  ws: '/engine/ws',
  none: '',
};

const getUrlPrefix = (config: any) => {
  // get the url prefix of the http request if defined
  if (config.urlPrefix) {
    return config.urlPrefix;
  }

  // get the prefix from request request type
  if (config.requestType) {
    return urlPrefixes[config.requestType as RequestTypesEnum];
  }

  return urlPrefixes[RequestTypesEnum.APIV6];
};

const apiClient = axios.create({});

apiClient.interceptors.request.use((config) => {
  return {
    ...config,
    url: `${getUrlPrefix(config)}${config.url}`,
  };
});

export default apiClient;
