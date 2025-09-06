import { apiClient } from '@ovh-ux/manager-core-api';
import { BrowserContext, Request as PlaywrightRequest } from '@playwright/test';
import { Handler } from './bdd.type';

export const toPlaywrightMockHandler = (context: BrowserContext) => ({
  url,
  api = 'v6',
  baseUrl,
  method = 'get',
  response,
  status = 200,
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
    async (route, request) => {
      if (request.method().toLowerCase() === method) {
        return route.fulfill({
          status,
          json:
            typeof response === 'function' ? await response(request) : response,
          body: responseText,
        });
      }
      return route.fallback();
    },
    { times: once ? 1 : undefined },
  );
};

export const getParamsFromUrl = (
  request: Request,
  params: Record<string, number>,
): Record<string, string> => {
  const splittedUrl = (request as unknown as PlaywrightRequest).url().split('/');
  return Object.entries(params).reduce<Record<string, string>>(
    (result, [name, index]) => ({
      ...result,
      [name]:
        splittedUrl[index < 0 ? splittedUrl.length + index : index] ?? '',
    }),
    {},
  );
};

/**
 * Wait for x miliseconds (30seconds by default)
 */
export const sleep = (timeout = 30000) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve('test');
    }, timeout),
  );
