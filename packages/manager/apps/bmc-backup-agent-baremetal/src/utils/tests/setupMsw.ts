import { SetupServer } from 'msw/node';

import {
  TBaremetalsMockParams,
  getBaremetalsMocks,
} from '@ovh-ux/backup-agent/mocks/baremetals/baremetals.handler';
import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

export type MockParams = TBaremetalsMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getBaremetalsMocks(mockParams),
    ]),
  );
};
