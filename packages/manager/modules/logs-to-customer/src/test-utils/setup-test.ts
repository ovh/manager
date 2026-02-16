import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import i18n from 'i18next';
import type { SetupServer } from 'msw/node';
import { setupServer } from 'msw/node';
import { initReactI18next } from 'react-i18next';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  lng: 'fr_FR',
  fallbackLng: 'fr_FR',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: { fr_FR: { translation: {} } },
});

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
