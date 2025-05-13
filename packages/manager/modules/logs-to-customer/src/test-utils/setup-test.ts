import { beforeAll, afterAll } from 'vitest';
import { SetupServer, setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import {
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var server: SetupServer;
  // eslint-disable-next-line vars-on-top, no-var, @typescript-eslint/naming-convention
  var __VERSION__: string;
}

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
