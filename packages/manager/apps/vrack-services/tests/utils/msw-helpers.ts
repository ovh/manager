import { http, RequestHandler, HttpResponse, delay } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';

const isTest = process.env.NODE_ENV === 'test';

export type Handler = {
  url: string;
  response?: any;
  headers?: HeadersInit;
  statusText?: string;
  type?: ResponseType;
  responseText?: string;
  delay?: number;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'all'
    | 'head'
    | 'options'
    | 'patch';
  status?: number;
  api?: 'v2' | 'v6' | 'aapi' | 'ws';
  baseUrl?: string;
  disabled?: boolean;
  once?: boolean;
};

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
            if (!isTest) {
              await delay(delayTime);
            }
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
