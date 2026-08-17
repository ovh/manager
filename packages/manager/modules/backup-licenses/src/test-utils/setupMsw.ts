import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';

import {
  TBackupLicenseMockParams,
  getBackupLicenseMocks,
} from '@/mocks/backupLicenses/backupLicenses.handler';
import { TIamMockParams, getIamMocks } from '@/mocks/iam/iam.handler';
import { TOrderMockParams, getOrderMocks } from '@/mocks/order/order.handler';
import { TTenantMockParams, getTenantMocks } from '@/mocks/tenants/tenants.handler';
import { TVaultMockParams, getVaultMocks } from '@/mocks/vaults/vaults.handler';

export type MockParams = GetServicesMocksParams &
  TTenantMockParams &
  TVaultMockParams &
  TIamMockParams &
  TOrderMockParams &
  TBackupLicenseMockParams;

export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getTenantMocks(mockParams),
      ...getBackupLicenseMocks(mockParams),
      ...getVaultMocks(mockParams),
      ...getIamMocks(mockParams),
      ...getOrderMocks(mockParams),
    ]),
  );
};
