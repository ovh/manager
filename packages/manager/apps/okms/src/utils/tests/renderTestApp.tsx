import React from 'react';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-module-common-api';

import { render, waitFor, screen } from '@testing-library/react';
import {
  getAuthenticationMocks,
  toMswHandlers,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import {
  createSecretsMock,
  CreateSecretsMockParams,
  getSecretMock,
  GetSecretMockParams,
  getSecretsMock,
  GetSecretsMockParams,
} from '@secret-manager/mocks/secrets/secrets.handler';
import { getLocationsMock } from '@secret-manager/mocks/locations/secrets.handler';
import {
  getVersionMock,
  GetVersionMockParams,
  getVersionsMock,
  GetVersionsMockParams,
} from '@secret-manager/mocks/versions/versions.handler';
import { removeHandlersDelay } from './testUtils';
import { initTestI18n } from './init.i18n';
import { getOkmsMocks, GetOkmsMocksParams } from '@/mocks/kms/okms.handler';
import {
  getServiceKeysMock,
  GetServiceKeysMockParams,
} from '@/mocks/serviceKeys/serviceKeys.handler';
import {
  getIamMocks,
  GetIamAuthorizationMockParams,
} from '@/mocks/iam/iam.handler';
import {
  getCredentialsMock,
  GetCredentialsMockParams,
  createCredentialsMock,
  CreateCredentialsMockParams,
  deleteCredentialMock,
  DeleteCredentialsMockParams,
} from '@/mocks/credentials/credentials.handler';
import { kmsServicesMock } from '@/mocks/services/services.mock';
import {
  GetFeatureAvailabilityMocksParams,
  getFeatureAvailabilityMocks,
} from '@/mocks/feature-availability/feature-availability.handler';
import {
  getCatalogKmsMocks,
  GetCatalogKmsMocksParams,
} from '@/mocks/catalog/catalog.handler';
import {
  getReferenceMock,
  GetReferenceMockParams,
} from '@/mocks/reference/reference.handler';
import { getIdentityUserIds } from '@/mocks/identity/identityUserIds.handler';
import { getIdentityUsers } from '@/mocks/identity/identityUsers.handler';
import { TestApp } from './TestApp';

let context: ShellContextType;
let i18nValue: i18n;

export type RenderTestMockParams = GetOkmsMocksParams &
  GetServiceKeysMockParams &
  GetCredentialsMockParams &
  GetServicesMocksParams &
  GetFeatureAvailabilityMocksParams &
  GetCatalogKmsMocksParams &
  GetReferenceMockParams &
  GetIamAuthorizationMockParams &
  DeleteCredentialsMockParams &
  CreateCredentialsMockParams &
  GetSecretsMockParams &
  GetSecretMockParams &
  CreateSecretsMockParams &
  GetVersionsMockParams &
  GetVersionMockParams;

export const renderTestApp = async (
  initialRoute = '/',
  mockParams: RenderTestMockParams = {},
) => {
  global.server?.resetHandlers(
    ...toMswHandlers(
      removeHandlersDelay([
        ...getAuthenticationMocks({ isAuthMocked: true }),
        ...getOkmsMocks(mockParams),
        ...getServiceKeysMock(mockParams),
        ...getServicesMocks({
          ...mockParams,
          serviceResponse: kmsServicesMock,
        }),
        ...getIamMocks(mockParams),
        ...getCredentialsMock(mockParams),
        ...getFeatureAvailabilityMocks(mockParams),
        ...getCatalogKmsMocks(mockParams),
        ...getReferenceMock(mockParams),
        ...createCredentialsMock(mockParams),
        ...deleteCredentialMock(mockParams),
        ...getIdentityUserIds(),
        ...getIdentityUsers(),
        ...getLocationsMock(),
        ...getSecretsMock(mockParams),
        ...getSecretMock(mockParams),
        ...createSecretsMock(mockParams),
        ...getVersionsMock(mockParams),
        ...getVersionMock(mockParams),
      ]),
    ),
  );

  if (!context) {
    context = await initShellContext('okms');
  }

  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  const result = render(
    <I18nextProvider i18n={i18nValue}>
      <ShellContext.Provider value={context}>
        <TestApp initialRoute={initialRoute} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText('Key Management Service', { exact: false })
            .length,
        ).toBeGreaterThan(0),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  }

  return result;
};
