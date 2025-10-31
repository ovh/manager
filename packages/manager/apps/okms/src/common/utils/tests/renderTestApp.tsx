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
  deleteSecretMock,
  DeleteSecretMockParams,
  getSecretMock,
  GetSecretMockParams,
  getSecretsMock,
  GetSecretsMockParams,
  updateSecretMock,
  UpdateSecretMockParams,
} from '@secret-manager/mocks/secrets/secrets.handler';
import {
  getSecretConfigOkmsMock,
  GetSecretConfigOkmsMockParams,
} from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.handler';
import {
  getSecretConfigReferenceMock,
  GetSecretConfigReferenceMockParams,
} from '@secret-manager/mocks/secret-reference/secretReference.handler';
import { getLocationsMock } from '@secret-manager/mocks/locations/locations.handler';
import {
  getVersionMock,
  GetVersionMockParams,
  getVersionsMock,
  GetVersionsMockParams,
  createVersionMock,
  CreateVersionMockParams,
  updateVersionMock,
  UpdateVersionMockParams,
} from '@secret-manager/mocks/versions/versions.handler';
import {
  getOkmsMocks,
  GetOkmsMocksParams,
} from '@key-management-service/mocks/kms/okms.handler';
import {
  getServiceKeysMock,
  GetServiceKeysMockParams,
} from '@key-management-service/mocks/service-keys/serviceKeys.handler';
import {
  getIamMocks,
  GetIamAuthorizationMockParams,
} from '@key-management-service/mocks/iam/iam.handler';
import {
  getCredentialsMock,
  GetCredentialsMockParams,
  createCredentialsMock,
  CreateCredentialsMockParams,
  deleteCredentialMock,
  DeleteCredentialsMockParams,
} from '@key-management-service/mocks/credentials/credentials.handler';
import { kmsServicesMock } from '@key-management-service/mocks/services/services.mock';
import {
  GetFeatureAvailabilityMocksParams,
  getFeatureAvailabilityMocks,
} from '@key-management-service/mocks/feature-availability/feature-availability.handler';
import {
  getCatalogKmsMocks,
  GetCatalogKmsMocksParams,
} from '@key-management-service/mocks/catalog/catalog.handler';
import {
  getReferenceMock,
  GetReferenceMockParams,
} from '@key-management-service/mocks/reference/reference.handler';
import { getIdentityUserIds } from '@key-management-service/mocks/identity/identityUserIds.handler';
import { getIdentityUsers } from '@key-management-service/mocks/identity/identityUsers.handler';
import { initTestI18n } from './init.i18n';
import { removeHandlersDelay } from './msw';
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
  UpdateSecretMockParams &
  DeleteSecretMockParams &
  GetSecretConfigOkmsMockParams &
  GetSecretConfigReferenceMockParams &
  GetVersionsMockParams &
  GetVersionMockParams &
  CreateVersionMockParams &
  UpdateVersionMockParams;

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
        ...updateSecretMock(mockParams),
        ...deleteSecretMock(mockParams),
        ...getSecretConfigOkmsMock(mockParams),
        ...getSecretConfigReferenceMock(mockParams),
        ...getVersionsMock(mockParams),
        ...getVersionMock(mockParams),
        ...createVersionMock(mockParams),
        ...updateVersionMock(mockParams),
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
