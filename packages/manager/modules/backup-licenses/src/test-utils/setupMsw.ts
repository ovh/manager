import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';

import { TIamMockParams, getIamMocks } from '@/mocks/iam/iam.handler';
import { TTenantMockParams, getTenantMocks } from '@/mocks/tenants/tenants.handler';
import { TVaultMockParams, getVaultMocks } from '@/mocks/vaults/vaults.handler';
import {
  TVaultOrderMockParams,
  installVaultOrderChannel,
} from '@/mocks/vaults/vaults.orderChannel';

export type MockParams = GetServicesMocksParams &
  TTenantMockParams &
  TVaultMockParams &
  TIamMockParams &
  TVaultOrderMockParams;

/**
 * Mocks MSW du service `/services` (v6) consommé par `useServiceDetailsQueryOption`/
 * `useDeleteService` (cf. §12 de la spec BKP-1226) : les appels du module lui-même
 * (`tenantsQueries`, `backupLicenseQueries`) restent mockés directement via `vi.mock`,
 * comme le reste des tests de pages de ce module.
 */
export const setupMswMock = (mockParams: MockParams = {}) => {
  // La commande d'un vault n'a pas de route : son issue est installée, pas servie par MSW.
  installVaultOrderChannel(mockParams);
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getTenantMocks(mockParams),
      ...getVaultMocks(mockParams),
      ...getIamMocks(mockParams),
    ]),
  );
};
