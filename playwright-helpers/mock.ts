import apiClient from '@ovh-ux/manager-core-api';
import { BrowserContext } from '@playwright/test';
import { Handler } from '../packages/super-components/_common/msw-helpers';

export const toPlaywrightMockHandler = (context: BrowserContext) => ({
  url,
  api = 'v6',
  baseUrl,
  method = 'get',
  response = {},
  status = 200,
}: Handler) => {
  const fullUrl = new RegExp(
    `${baseUrl ?? apiClient[api].getUri()}${
      url.startsWith('/') ? '' : '/'
    }${url}$`.replace(':id', '.*'),
  );
  return context.route(fullUrl, (route, request) => {
    if (request.method().toLowerCase() === method) {
      return route.fulfill({
        status,
        json: response,
      });
    }
    return route.continue();
  });
};
