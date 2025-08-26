import { http, RequestHandler, HttpResponse } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';
import { Handler } from '../types';

export const toMswHandlers = (handlers: Handler[] = []): RequestHandler[] =>
  handlers
    .filter(Boolean)
    .filter(({ disabled }) => !disabled)
    .map(
      ({
        url,
        method = 'get',
        headers,
        type,
        statusText,
        status = 200,
        response,
        responseText,
        api = 'v6',
        baseUrl,
        once,
      }: Handler) =>
        http[method](
          `${baseUrl ?? apiClient[api].getUri()}${
            url.startsWith('/') ? '' : '/'
          }${url}`,
          async ({ request, params, cookies }) => {
            if (responseText) {
              return HttpResponse.text(responseText);
            }
            const json =
              typeof response === 'function'
                ? await response(request, params, cookies)
                : response;
            return HttpResponse.json(json, {
              status,
              headers,
              type,
              statusText,
            });
          },
          { once },
        ),
    );
