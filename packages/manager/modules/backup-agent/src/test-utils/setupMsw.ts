import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';

import { TLocationMockParams, getLocationMocks } from '@/mocks/location/locations.handler';
import { TTenantMockParams, getTenantMocks } from '@/mocks/tenant/tenants.handler';
import { TVSPCTenantMockParams, getVSPCTenantMocks } from '@/mocks/tenant/vspcTenants.handler';
import { TVaultMockParams, getVaultMocks } from '@/mocks/vaults/vaults.handler';

export type MockParams = TVaultMockParams &
  TLocationMockParams &
  TTenantMockParams &
  TVSPCTenantMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getVaultMocks(mockParams),
      ...getLocationMocks(mockParams),
      ...getTenantMocks(mockParams),
      ...getVSPCTenantMocks(mockParams),
    ]),
  );
};
