import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { TBaremetalsMockParams, getBaremetalsMocks } from '@/mocks/baremetals/baremetals.handler';

export type MockParams = TBaremetalsMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getBaremetalsMocks(mockParams),
    ]),
  );
};
