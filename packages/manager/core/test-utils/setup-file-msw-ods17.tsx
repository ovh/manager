import { beforeAll, afterAll } from 'vitest';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { setupServer } from 'msw/node';
import { toMswHandlers } from './src/utils';
import { getAuthenticationMocks } from './src/auth';
import 'element-internals-polyfill';

odsSetup();

const server = setupServer(
  ...toMswHandlers([
    ...getAuthenticationMocks({ isAuthMocked: true, region: 'EU' }),
  ]),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  delete global.server;
  global.__VERSION__ = null;
  global.server = server;
});

afterAll(() => {
  server.close();

  delete global.__VERSION__;
});

afterEach(() => {
  server.resetHandlers();
});
