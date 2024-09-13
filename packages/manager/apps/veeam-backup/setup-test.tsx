import { beforeAll, afterAll } from 'vitest';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { setupServer } from 'msw/node';
import { toMswHandlers } from '../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../playwright-helpers/mocks/auth';

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
