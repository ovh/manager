import React from 'react';
import { SetupServer } from 'msw/node';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { expect } from 'vitest';
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
  getCatalogMocks,
  GetCatalogMocksParams,
  getVeeamBackupMocks,
  getOrganizationMocks,
  GetOrganizationMocksParams,
  getDatacentresMocks,
  GetDatacentresMocksParams,
  getDatacentreOrderMocks,
  GetDatacentreOrderMocksParams,
  GetVeeamBackupMocksParams,
  getIamMocks,
  getVcdDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import {
  initTestI18n,
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { info } from 'console';
import { translations } from './test-i18n';
import { TestApp } from './TestApp';
import { APP_NAME } from '@/tracking.constant';
import { MANAGED_VCD_LABEL } from '@/pages/dashboard/organization/organizationDashboard.constants';

let context: ShellContextType;
let i18n: i18n;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetOrganizationMocksParams &
  GetDatacentresMocksParams &
  GetDatacentreOrderMocksParams &
  GetVeeamBackupMocksParams &
  GetCatalogMocksParams &
  GetServicesMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getVeeamBackupMocks(mockParams),
      ...getOrganizationMocks(mockParams),
      ...getDatacentresMocks(mockParams),
      ...getDatacentreOrderMocks(mockParams),
      ...getIamMocks(),
      ...getServicesMocks(mockParams),
      ...getCatalogMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext(APP_NAME);
  }

  if (!i18n) {
    i18n = await initTestI18n(APP_NAME, translations);
  }

  const result = render(
    <I18nextProvider i18n={i18n}>
      <ShellContext.Provider value={context}>
        <TestApp initialRoute={initialRoute} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(MANAGED_VCD_LABEL, {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
