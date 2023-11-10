import { rest, RequestHandler } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';

const isTest = process.env.NODE_ENV === 'test';

export type Handler = {
  url: string;
  response?: any;
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
  error?: string;
};

export const toMswHandlers = (handlers: Handler[]): RequestHandler[] =>
  handlers
    .filter(({ disabled }) => !disabled)
    .map(
      ({
        url,
        method = 'get',
        delay = isTest ? 0 : 5000,
        status = 200,
        response,
        responseText,
        api = 'v6',
        baseUrl,
        once,
        error,
      }: Handler) =>
        rest[method](
          `${baseUrl ?? apiClient[api].getUri()}${
            url.startsWith('/') ? '' : '/'
          }${url}`,
          (req, res, ctx) => {
            if (error) {
              return res.networkError(error);
            }

            const responseFn = once ? res.once : res;
            const json =
              typeof response === 'function'
                ? response(req, res, ctx)
                : response;
            return responseFn(
              ...[
                delay && ctx.delay(delay),
                json && ctx.json(json),
                responseText && ctx.text(responseText),
                status && ctx.status(status),
              ].filter(Boolean),
            );
          },
        ),
    );
