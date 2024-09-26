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
} from '@ovh-ux/manager-react-components/src/hooks/services/mocks/services.mock';
import { toMswHandlers } from '../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../playwright-helpers/mocks/auth';
import {
  getVeeamBackupMocks,
  getOrganizationMocks,
  GetOrganizationMocksParams,
  GetVeeamBackupMocksParams,
  getIamMocks,
} from '../../mocks';
import { productFullName } from '../../src/veeam-backup.config';
import { initTestI18n } from './test-i18n';
import { TestApp } from './TestApp';

let context: ShellContextType;
let i18n: i18n;

export const setupTest = async (
  mockParams: GetOrganizationMocksParams &
    GetVeeamBackupMocksParams &
    GetServicesMocksParams = {},
) => {
  (global.server as SetupServer)?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getVeeamBackupMocks(mockParams),
      ...getOrganizationMocks(mockParams),
      ...getIamMocks(),
      ...getServicesMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext('veeam-backup');
  }

  if (!i18n) {
    i18n = await initTestI18n();
  }

  const result = render(
    <I18nextProvider i18n={i18n}>
      <ShellContext.Provider value={context}>
        <TestApp />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  await waitFor(
    () =>
      expect(
        screen.getAllByText(productFullName, { exact: false }).length,
      ).toBeGreaterThan(0),
    { timeout: 30000 },
  );

  return result;
};
