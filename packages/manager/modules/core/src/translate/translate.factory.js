import find from 'lodash/find';
import startsWith from 'lodash/startsWith';

import {
  HEADER_LOCALE,
  ROUTES_PREFIX,
} from './translate.constants';

export default /*  @ngInject  */ (TranslateService) => ({
  request: (config) => {
    if (find(ROUTES_PREFIX, (route) => startsWith(config.url, route))) {
      return {
        ...config,
        headers: {
          ...config.headers,
          [HEADER_LOCALE]: TranslateService.getUserLocale(),
        },
      };
    }
    return config;
  },
});
