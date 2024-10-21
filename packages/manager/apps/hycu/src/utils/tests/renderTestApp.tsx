import React from 'react';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { render, waitFor, screen } from '@testing-library/react';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-react-components/src/hooks/services/mocks/services.mock';
import { TestApp } from './TestApp';
import { initTestI18n } from './init.i18n';
import { toMswHandlers } from '../../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../../playwright-helpers/mocks/auth';
import { getLicenseHycuMocks, GetLicenseHycuMocksParams } from '@/mocks';

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (
  mockParams: GetServicesMocksParams & GetLicenseHycuMocksParams = {},
) => {
  global.server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getLicenseHycuMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext('hycu');
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
        screen.getAllByText('HYCU', { exact: false }).length,
      ).toBeGreaterThan(0),
    { timeout: 30000 },
  );

  return result;
};
