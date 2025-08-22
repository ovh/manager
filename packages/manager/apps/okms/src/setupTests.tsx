import { vi } from 'vitest';
import React from 'react';
import { SetupServer, setupServer } from 'msw/node';
import {
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.server;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.__VERSION__ = null;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.server = server;
});

afterAll(() => {
  server.close();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.__VERSION__;
});

afterEach(() => {
  server.resetHandlers();
});

// Mocking ODS Drawer component
vi.mock('@ovh-ux/manager-react-components', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...original,
    Drawer: vi.fn(({ children, className, ...props }) => (
      <div data-testid={props['data-testid']} className={className}>
        <header>{props.heading}</header>
        {children}
      </div>
    )),
  };
});
