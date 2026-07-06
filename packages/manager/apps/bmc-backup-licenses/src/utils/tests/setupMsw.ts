import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

export const setupMswMock = () => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([...getAuthenticationMocks({ isAuthMocked: true })]),
  );
};
