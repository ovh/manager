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
} from '@ovh-ux/manager-react-components';
import { TestApp } from './TestApp';
import { getTesti18nParams, initTestI18n } from './init.i18n';
import { toMswHandlers } from '../../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../../playwright-helpers/mocks/auth';
import {
  CatalogHycuMocksParams,
  getCatalogHycuMocks,
  getLicenseHycuMocks,
  GetLicenseHycuMocksParams,
  getServiceLicenseHycuMocks,
  GetServiceLicenseHycuMocksParams,
} from '@/mocks';

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (
  initialRoute = '/',
  mockParams: GetServicesMocksParams &
    GetLicenseHycuMocksParams &
    GetServicesMocksParams &
    CatalogHycuMocksParams &
    GetServiceLicenseHycuMocksParams = {},
) => {
  global.server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getLicenseHycuMocks(mockParams),
      ...getServiceLicenseHycuMocks(mockParams),
      ...getServicesMocks(mockParams),
      ...getCatalogHycuMocks(mockParams),
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
        <TestApp initialRoute={initialRoute} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText('HYCU', { exact: false }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
