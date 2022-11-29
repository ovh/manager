import { getHeaders, defineApplicationVersion } from '@ovh-ux/request-tagger';

export default /* @ngInject */ () => {
  return {
    setHeaderVersion: (version) => {
      defineApplicationVersion(version);
    },
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
