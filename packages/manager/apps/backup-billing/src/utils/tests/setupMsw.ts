import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { TLocationMockParams, getLocationMocks } from '@/mocks/locations/locations.handler';

export type MockParams = TLocationMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getLocationMocks(mockParams),
    ]),
  );
};
