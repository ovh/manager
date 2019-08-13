import find from 'lodash/find';
import omit from 'lodash/omit';
import startsWith from 'lodash/startsWith';

import {
  HEADER_NAVIGATION_ID,
  HEADER_REQUEST_ID,
  HEADER_PAGE,
  ROUTES_PREFIX,
  ROUTES_HEADERS_OVERRIDE,
} from './constants';

export default /* @ngInject */ () => {
  let requestIndex = 0;
  return {
    request: (config) => {
      if (find(ROUTES_PREFIX, route => startsWith(config.url, route))) {
        requestIndex += 1;
        const overridenHeaders = find(
          ROUTES_HEADERS_OVERRIDE,
          (value, route) => new RegExp(route).test(config.url),
        ) || {};

        return {
          ...config,
          headers: {
            ...config.headers,
            [HEADER_REQUEST_ID]: `${Date.now()}-${requestIndex}`,
            ...overridenHeaders,
          },
        };
      }

      return {
        ...config,
        headers: omit(config.headers, [
          HEADER_NAVIGATION_ID,
          HEADER_REQUEST_ID,
          HEADER_PAGE,
        ]),
      };
    },
  };
};
