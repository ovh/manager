import React from 'react';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { render, waitFor, screen } from '@testing-library/react';
import { TestApp } from './TestApp';
import { initTestI18n } from './init.i18n';
import { toMswHandlers } from '../../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../../playwright-helpers/mocks/auth';
import { getOkmsMocks, GetOkmsMocksParams } from '@/mocks/okms.mock';
import { getServicesMocks } from '@/mocks/services.mock';

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (mockParams: GetOkmsMocksParams = {}) => {
  global.server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getOkmsMocks(mockParams),
      ...getServicesMocks(),
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
        <TestApp />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  await waitFor(
    () =>
      expect(
        screen.getAllByText('Key Management Service', { exact: false }).length,
      ).toBeGreaterThan(0),
    { timeout: 30000 },
  );

  return result;
};
