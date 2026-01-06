import {
  CreateCredentialsMockParams,
  DeleteCredentialsMockParams,
  GetCredentialsMockParams,
  createCredentialsMock,
  deleteCredentialMock,
  getCredentialsMock,
} from '@key-management-service/mocks/credentials/credentials.handler';
import {
  GetFeatureAvailabilityMocksParams,
  getFeatureAvailabilityMocks,
} from '@key-management-service/mocks/feature-availability/feature-availability.handler';
import {
  GetIamAuthorizationMockParams,
  getIamMocks,
} from '@key-management-service/mocks/iam/iam.handler';
import { getIdentityUserIds } from '@key-management-service/mocks/identity/identityUserIds.handler';
import { getIdentityUsers } from '@key-management-service/mocks/identity/identityUsers.handler';
import { GetOkmsMocksParams, getOkmsMocks } from '@key-management-service/mocks/kms/okms.handler';
import {
  GetReferenceMockParams,
  getReferenceMock,
} from '@key-management-service/mocks/reference/reference.handler';
import {
  GetServiceKeysMockParams,
  getServiceKeysMock,
} from '@key-management-service/mocks/service-keys/serviceKeys.handler';
import { kmsServicesMock } from '@key-management-service/mocks/services/services.mock';
import {
  GetSecretConfigOkmsMockParams,
  UpdateSecretConfigOkmsMockParams,
  getSecretConfigOkmsMock,
  updateSecretConfigOkmsMock,
} from '@secret-manager/mocks/secret-config-okms/secretConfigOkms.handler';
import {
  GetSecretConfigReferenceMockParams,
  getSecretConfigReferenceMock,
} from '@secret-manager/mocks/secret-reference/secretReference.handler';
import {
  CreateSecretsMockParams,
  DeleteSecretMockParams,
  GetSecretMockParams,
  GetSecretsMockParams,
  UpdateSecretMockParams,
  createSecretsMock,
  deleteSecretMock,
  getSecretMock,
  getSecretsMock,
  updateSecretMock,
} from '@secret-manager/mocks/secrets/secrets.handler';
import {
  CreateVersionMockParams,
  GetVersionMockParams,
  GetVersionsMockParams,
  UpdateVersionMockParams,
  createVersionMock,
  getVersionMock,
  getVersionsMock,
  updateVersionMock,
} from '@secret-manager/mocks/versions/versions.handler';
import { render, screen, waitFor } from '@testing-library/react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';
import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import {
  GetCatalogKmsMocksParams,
  getCatalogKmsMocks,
} from '@/common/mocks/catalog/catalog.handler';
import { getLocationsMock } from '@/common/mocks/locations/locations.handler';
import { getReferenceRegionsMock } from '@/common/mocks/reference-regions/referenceRegions.handler';

import { TestApp } from './TestApp';
import { initTestI18n } from './init.i18n';
import { removeHandlersDelay } from './msw';

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
  UpdateSecretConfigOkmsMockParams &
  GetSecretConfigReferenceMockParams &
  GetVersionsMockParams &
  GetVersionMockParams &
  CreateVersionMockParams &
  UpdateVersionMockParams;

export const renderTestApp = async (initialRoute = '/', mockParams: RenderTestMockParams = {}) => {
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
        ...getReferenceRegionsMock(),
        ...getSecretsMock(mockParams),
        ...getSecretMock(mockParams),
        ...createSecretsMock(mockParams),
        ...updateSecretMock(mockParams),
        ...deleteSecretMock(mockParams),
        ...getSecretConfigOkmsMock(mockParams),
        ...updateSecretConfigOkmsMock(mockParams),
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
          screen.getAllByText('Key Management Service', { exact: false }).length,
        ).toBeGreaterThan(0),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  }

  return result;
};
