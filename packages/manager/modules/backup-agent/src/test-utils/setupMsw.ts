import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';

import {
  TAgentDownloadLinkMockParams,
  getAgentDownloadLinksMocks,
} from '@/mocks/agents/agentDownloadLinks.handler';
import { TAgentMockParams, getAgentMocks } from '@/mocks/agents/agents.handler';
import { TLocationMockParams, getLocationMocks } from '@/mocks/location/locations.handler';
import {
  TTenantBackupPolicieMockParams,
  getTenantBackupPolicieMocks,
} from '@/mocks/tenant/backupPolicies.handler';
import { TTenantMockParams, getTenantMocks } from '@/mocks/tenant/tenants.handler';
import { TVSPCTenantMockParams, getVSPCTenantMocks } from '@/mocks/tenant/vspcTenants.handler';
import { TVaultMockParams, getVaultMocks } from '@/mocks/vaults/vaults.handler';

export type MockParams = TVaultMockParams &
  TLocationMockParams &
  TTenantMockParams &
  TAgentMockParams &
  TVSPCTenantMockParams &
  GetServicesMocksParams &
  TTenantBackupPolicieMockParams &
  TAgentDownloadLinkMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getVaultMocks(mockParams),
      ...getLocationMocks(mockParams),
      ...getTenantMocks(mockParams),
      ...getAgentMocks(mockParams),
      ...getVSPCTenantMocks(mockParams),
      ...getTenantBackupPolicieMocks(mockParams),
      ...getAgentDownloadLinksMocks(mockParams),
    ]),
  );
};
