import { rest, RequestHandler } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';

export type Handler = {
  url: string;
  response?: any;
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
};

export const toMswHandlers = (handlers: Handler[]): RequestHandler[] =>
  handlers.map(
    ({
      url,
      method = 'get',
      delay = 5000,
      status = 200,
      response = {},
      api = 'v6',
      baseUrl,
    }: Handler) =>
      rest[method](
        `${baseUrl ?? apiClient[api].getUri()}${
          url.startsWith('/') ? '' : '/'
        }${url}`,
        (_, res, ctx) =>
          res(
            ...[
              delay && ctx.delay(delay),
              response && ctx.json(response),
              status && ctx.status(status),
            ].filter(Boolean),
          ),
      ),
  );
