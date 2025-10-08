import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { TLocationMockParams, getLocationMocks } from '@/mocks/location/location.handler';
import { TTenantMockParams, getTenantMocks } from '@/mocks/tenant/tenants.handler';
import { TVSPCTenantMockParams, getVSPCTenantMocks } from '@/mocks/tenant/vspcTenants.handler';

export type TMockParams = TLocationMockParams & TTenantMockParams & TVSPCTenantMockParams;

export const setupMswMock = (mockParams: TMockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getLocationMocks(mockParams),
      ...getTenantMocks(mockParams),
      ...getVSPCTenantMocks(mockParams),
    ]),
  );
};
