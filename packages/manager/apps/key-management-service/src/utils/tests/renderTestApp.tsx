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
} from '@ovh-ux/manager-react-components';
import { render, waitFor, screen } from '@testing-library/react';
import { TestApp } from './TestApp';
import { initTestI18n } from './init.i18n';
import { toMswHandlers } from '../../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../../playwright-helpers/mocks/auth';
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
} from '@/mocks/credentials/credentials.handler';
import { kmsServicesMock } from '@/mocks/services/services.mock';

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (
  initialRoute = '/',
  mockParams: GetOkmsMocksParams &
    GetServiceKeysMockParams &
    GetCredentialsMockParams &
    GetServicesMocksParams &
    GetIamAuthorizationMockParams = {},
) => {
  global.server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getOkmsMocks(mockParams),
      ...getServiceKeysMock(mockParams),
      ...getServicesMocks({ ...mockParams, serviceResponse: kmsServicesMock }),
      ...getIamMocks(mockParams),
      ...getCredentialsMock(mockParams),
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
      { timeout: 30000 },
    );
  }

  return result;
};
