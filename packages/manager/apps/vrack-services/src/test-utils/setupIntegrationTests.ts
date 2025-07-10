import { beforeAll, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import {
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import 'element-internals-polyfill';

declare const global: any;

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

vi.mock('element-internals-polyfill/dist/utils.js', async () => {
  console.log('🔧 mock polyfill');
  const actual = await vi.importActual<any>(
    'element-internals-polyfill/dist/utils.js',
  );
  return {
    ...actual,
    upgradeInternals: (internals: any = {}) => {
      const {
        labels = [],
        validationMessage = '',
        validity = {},
        willValidate = false,
        ...rest
      } = internals || {};
      return { labels, validationMessage, validity, willValidate, ...rest };
    },
  };
});

if (!HTMLElement.prototype.attachInternals) {
  console.log('🔧 attachInternals polyfill used');
  HTMLElement.prototype.attachInternals = () => ({
    labels: [],
    validity: {},
    willValidate: false,
    setFormValue: () => {},
    shadowRoot: null,
  });
}

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
