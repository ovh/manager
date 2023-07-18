import apiClient from '@ovh-ux/manager-core-api';
import { BrowserContext } from '@playwright/test';
import { Handler } from '../packages/super-components/_common/msw-helpers';

export const toPlaywrightMockHandler = (context: BrowserContext) => ({
  url,
  api = 'v6',
  baseUrl,
  method = 'get',
  response,
  status = 200,
  error,
  responseText,
  once,
}: Handler) => {
  const fullUrl = new RegExp(
    `${baseUrl ?? apiClient[api].getUri()}${
      url.startsWith('/') ? '' : '/'
    }${url}`.replace(/:[a-zA-Z]+/gm, '[^/]+'),
  );
  return context.route(
    fullUrl,
    (route, request) => {
      if (error) {
        return route.abort();
      }
      if (request.method().toLowerCase() === method) {
        return route.fulfill({
          status,
          json: typeof response === 'function' ? response(request) : response,
          body: responseText,
        });
      }
      return route.continue();
    },
    { times: once ? 1 : undefined },
  );
};

export default toPlaywrightMockHandler;
