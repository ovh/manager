import { getHeaders } from '@ovh-ux/request-tagger';

export default /* @ngInject */ () => {
  return {
    request: (config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          ...getHeaders(config.url),
        },
      };
    },
  };
};
