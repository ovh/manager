import React from 'react';
import { SetupServer } from 'msw/node';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { render, waitFor, screen } from '@testing-library/react';
import {
  getServicesMocks,
  GetServicesMocksParams,
} from '@ovh-ux/manager-module-common-api';
import {
  getOrganizationMocks,
  GetOrganizationMocksParams,
  getVeeamBackupMocks,
  GetVeeamBackupMocksParams,
  getCatalogMocks,
  GetCatalogMocksParams,
} from '@ovh-ux/manager-module-vcd-api';
import {
  initTestI18n,
  toMswHandlers,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import { getIamMocks, getServiceConsumptionMocks } from '../../mocks';
import { appName, productName } from '../veeam-backup.config';
import { translations } from './labels';
import { TestApp } from './TestApp';

let context: ShellContextType;
let i18n: i18n;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: { initialRoute?: string } & GetOrganizationMocksParams &
  GetVeeamBackupMocksParams &
  GetCatalogMocksParams &
  GetServicesMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getVeeamBackupMocks(mockParams),
      ...getOrganizationMocks(mockParams),
      ...getCatalogMocks(mockParams),
      ...getIamMocks(),
      ...getServicesMocks(mockParams),
      ...getServiceConsumptionMocks(),
    ]),
  );

  if (!context) {
    context = await initShellContext('veeam-backup');
  }

  if (!i18n) {
    i18n = await initTestI18n(appName, translations);
  }

  const result = render(
    <I18nextProvider i18n={i18n}>
      <ShellContext.Provider value={context}>
        <TestApp initialRoute={initialRoute} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  if (!initialRoute) {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(productName, { exact: false }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
