import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import startsWith from 'lodash/startsWith';

import {
  HEADER_NAVIGATION_ID,
  HEADER_REQUEST_ID,
  HEADER_PAGE,
  HEADER_VERSION,
  ROUTES_PREFIX,
  ROUTES_HEADERS_OVERRIDE,
} from './constants';

export default /* @ngInject */ () => {
  let requestIndex = 0;
  let headerVersion = null;
  return {
    setHeaderVersion: (version) => {
      headerVersion = version;
    },
    request: (config) => {
      if (find(ROUTES_PREFIX, (route) => startsWith(config.url, route))) {
        requestIndex += 1;
        const overridenHeaders = find(
          ROUTES_HEADERS_OVERRIDE,
          (value, route) => new RegExp(route).test(config.url),
        ) || {};

        const headerConfig = {
          ...config,
          headers: {
            ...config.headers,
            [HEADER_REQUEST_ID]: `${Date.now()}-${requestIndex}`,
            ...overridenHeaders,
          },
        };
        if (!isEmpty(headerVersion)) {
          headerConfig.headers[HEADER_VERSION] = headerVersion;
        }
        return headerConfig;
      }

      return {
        ...config,
        headers: omit(config.headers, [
          HEADER_NAVIGATION_ID,
          HEADER_REQUEST_ID,
          HEADER_PAGE,
          HEADER_VERSION,
        ]),
      };
    },
  };
};
