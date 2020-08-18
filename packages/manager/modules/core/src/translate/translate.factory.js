import { find, startsWith } from 'lodash-es';

import { Environment } from '@ovh-ux/manager-config';

import { HEADER_LOCALE, ROUTES_PREFIX } from './translate.constants';

export default /* @ngInject */ () => ({
  request: (config) => {
    if (find(ROUTES_PREFIX, (route) => startsWith(config.url, route))) {
      return {
        ...config,
        headers: {
          ...config.headers,
          [HEADER_LOCALE]: Environment.getUserLocale(),
        },
      };
    }
    return config;
  },
});
