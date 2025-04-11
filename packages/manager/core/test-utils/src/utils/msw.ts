import { http, RequestHandler, HttpResponse, delay } from 'msw';
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
        delay: delayTime = 1000,
        status = 200,
        response,
        icebergResponse,
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
            await delay(delayTime);
            if (responseText) {
              return HttpResponse.text(responseText);
            }
            const requestHeaders = new Headers(request?.headers);
            const isIceberg =
              requestHeaders.get('X-Pagination-Size') ||
              requestHeaders.get('x-pagination-mode');

            let json;
            if (isIceberg && icebergResponse) {
              json =
                typeof icebergResponse === 'function'
                  ? await icebergResponse(request, params, cookies)
                  : icebergResponse;
            } else {
              json =
                typeof response === 'function'
                  ? await response(request, params, cookies)
                  : response;
            }

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
