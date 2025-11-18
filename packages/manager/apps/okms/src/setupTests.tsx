import { vi } from 'vitest';
import { SetupServer, setupServer } from 'msw/node';
import {
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';

declare global {
  var server: SetupServer;
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

type DrawerProps = {
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
  heading?: React.ReactNode;
  isLoading?: boolean;
};

// Mocking ODS Drawer component
vi.mock('@ovh-ux/manager-react-components', async () => {
  const original = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...original,
    Drawer: vi.fn(
      ({
        children,
        className,
        ...props
      }: DrawerProps) => (
        <div data-testid={props['data-testid']} className={className}>
          <header>{props.heading}</header>
          {!props.isLoading && children}
        </div>
      ),
    ),
  };
});
