import { SetupServer } from 'msw/node';

import { getAuthenticationMocks, toMswHandlers } from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';

export type MockParams = GetServicesMocksParams;

/**
 * Mocks MSW du service `/services` (v6) consommé par `useServiceDetailsQueryOption`/
 * `useDeleteService` (cf. §12 de la spec BKP-1226) : les appels du module lui-même
 * (`tenantsQueries`, `backupLicenseQueries`) restent mockés directement via `vi.mock`,
 * comme le reste des tests de pages de ce module.
 */
export const setupMswMock = (mockParams: MockParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
    ]),
  );
};
