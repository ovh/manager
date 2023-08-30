import { rest } from 'msw';
import { apiClient } from '@ovh-ux/manager-core-api';
import contactResponse from './v6/me-contact.json';

type Handler = {
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

export const config: Handler[] = [
  {
    url: 'me/contact/:id',
    response: contactResponse,
  },
];

export default config.map(
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
      `${baseUrl ?? apiClient[api].getUri()}/${url}`,
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
