import { beforeAll, afterAll } from 'vitest';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { setupServer } from 'msw/node';
import { toMswHandlers } from '../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../playwright-helpers/mocks/auth';
import '@testing-library/jest-dom';
// PATCH for ODS Component to fix Error: Uncaught [TypeError: _this.attachInternals is not a function]
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
  delete global.server;
});

afterEach(() => {
  server.resetHandlers();
});
