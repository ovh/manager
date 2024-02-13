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
    (route, request) => {
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

export const getParamsFromUrl = (
  request: Request,
  params: Record<string, number>,
) => {
  const splittedUrl = ((request as unknown) as PlaywrightRequest)
    .url()
    .split('/');
  return Object.entries(params).reduce(
    (result, [name, index]) => ({
      ...result,
      [name]: splittedUrl[index < 0 ? splittedUrl.length + index : index],
    }),
    {} as Record<string, string>,
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
