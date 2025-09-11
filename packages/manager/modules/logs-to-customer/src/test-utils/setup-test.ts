import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { SetupServer, setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

declare global {
  var server: SetupServer | undefined;
  var __VERSION__: string | null | undefined;
}

const server = setupServer(
  ...toMswHandlers([...getAuthenticationMocks({ isAuthMocked: true, region: 'EU' })]),
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
