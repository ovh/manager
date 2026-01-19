import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { SetupServer, setupServer } from 'msw/node';
import { vi } from 'vitest';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

declare global {
  var server: SetupServer;
  var __VERSION__: string;
}

const server = setupServer(
  ...toMswHandlers([...getAuthenticationMocks({ isAuthMocked: true, region: 'EU' })]),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.server;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.__VERSION__ = null;
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
    Drawer: vi.fn(({ children, className, ...props }: DrawerProps) => (
      <div data-testid={props['data-testid']} className={className}>
        <header>{props.heading}</header>
        {!props.isLoading && children}
      </div>
    )),
  };
});

vi.mock('@/common/hooks/useOkmsTracking', () => ({
  useOkmsTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
}));
