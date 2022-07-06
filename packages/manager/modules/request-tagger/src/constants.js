export const HEADER_NAVIGATION_ID = 'X-OVH-MANAGER-NAVIGATION-ID';
export const HEADER_REQUEST_ID = 'X-OVH-MANAGER-REQUEST-ID';
export const HEADER_PAGE = 'X-OVH-MANAGER-PAGE';
export const HEADER_VERSION = 'X-OVH-MANAGER-VERSION';

export const DEFAULT_PAGE = 'bootstrap';

export const ROUTES_PREFIX = ['/engine/apiv6', '/engine/2api'];

export const ROUTES_HEADERS_OVERRIDE = {
  '^/engine/2api/service': {
    [HEADER_PAGE]: 'sidebar',
  },
};

export default {
  DEFAULT_PAGE,
  HEADER_NAVIGATION_ID,
  HEADER_REQUEST_ID,
  HEADER_PAGE,
  HEADER_VERSION,
  ROUTES_PREFIX,
  ROUTES_HEADERS_OVERRIDE,
};
