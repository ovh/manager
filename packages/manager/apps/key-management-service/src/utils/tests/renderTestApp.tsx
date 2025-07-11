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
import { TestApp } from './TestApp';
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

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (
  initialRoute = '/',
  mockParams: GetOkmsMocksParams &
    GetServiceKeysMockParams &
    GetCredentialsMockParams &
    GetServicesMocksParams &
    GetFeatureAvailabilityMocksParams &
    GetCatalogKmsMocksParams &
    GetReferenceMockParams &
    GetIamAuthorizationMockParams &
    DeleteCredentialsMockParams &
    CreateCredentialsMockParams = {},
) => {
  global.server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getOkmsMocks(mockParams),
      ...getServiceKeysMock(mockParams),
      ...getServicesMocks({ ...mockParams, serviceResponse: kmsServicesMock }),
      ...getIamMocks(mockParams),
      ...getCredentialsMock(mockParams),
      ...getFeatureAvailabilityMocks(mockParams),
      ...getCatalogKmsMocks(mockParams),
      ...getReferenceMock(mockParams),
      ...createCredentialsMock(mockParams),
      ...deleteCredentialMock(mockParams),
      ...getIdentityUserIds(),
      ...getIdentityUsers(),
    ]),
  );

  if (!context) {
    context = await initShellContext('key-management-service');
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
