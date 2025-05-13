import { find, startsWith } from 'lodash-es';

import { HEADER_LOCALE, ROUTES_PREFIX } from './translate.constants';

export default /* @ngInject */ (coreConfig) => ({
  request: (config) => {
    if (find(ROUTES_PREFIX, (route) => startsWith(config.url, route))) {
      return {
        ...config,
        headers: {
          ...config.headers,
          [HEADER_LOCALE]: coreConfig.getUserLocale(),
        },
      };
    }
    return config;
  },
});
