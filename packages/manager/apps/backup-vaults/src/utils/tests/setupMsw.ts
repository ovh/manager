import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { TLocationMockParams, getLocationMocks } from '@/mocks/location/locations.handler';
import { TVaultMockParams, getVaultMocks } from '@/mocks/vault/vaults.handler';

export type MockParams = TVaultMockParams & TLocationMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getVaultMocks(mockParams),
      ...getLocationMocks(mockParams),
    ]),
  );
};
