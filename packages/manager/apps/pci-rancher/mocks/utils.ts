import { http, RequestHandler, HttpResponse, delay, PathParams } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';

export const manageError = ({
  status,
  headers,
  type,
  statusText,
}: {
  status: number;
  headers: HeadersInit;
  type: ResponseType;
  statusText: string;
}) => {
  if (status === 500) {
    throw new Error(
      'The Managed Rancher Service API is in maintenance mode. Only GET endpoints are available.',
    );
  }
  if (status === 403) {
    return HttpResponse.json(
      {
        status: 403,
        code: 'ERR_KUBE_SERVICES',
        response: {
          data: { message: 'Error Kube Services' },
        },
      },
      {
        headers,
        type,
        statusText,
      },
    );
  }
  return null;
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
            manageError({ status, headers, type, statusText });
            await delay(delayTime);
            if (responseText) {
              return HttpResponse.text(responseText);
            }
            const object =
              typeof response === 'function'
                ? ((await response({
                    request,
                    params,
                    cookies,
                    context: { url, status, method, headers, type },
                  })) as { json: unknown; newStatus?: number })
                : response;

            return HttpResponse.json(
              object.json && object.newStatus
                ? object.json
                : (object as unknown),
              {
                status,
                headers,
                type,
                statusText,
              },
            );
          },
          { once },
        ),
    );

export type Handler = {
  url: string;
  response?: ({
    request,
    params,
    cookies,
    context,
  }: {
    request: Request;
    params: PathParams;
    cookies: Record<string, string>;
    context: Handler;
  }) => Promise<{ json: unknown; newStatus?: number } | unknown> | unknown;

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
