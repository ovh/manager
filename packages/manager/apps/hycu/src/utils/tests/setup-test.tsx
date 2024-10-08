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
import { expect } from 'vitest';
import { toMswHandlers } from '../../../../../../../playwright-helpers';
import { getAuthenticationMocks } from '../../../../../../../playwright-helpers/mocks/auth';
import { getLicenseHycuMocks, GetLicenseHycuMocksParams } from '../../mocks';
import { initTestI18n } from './init.i18n';
import { TestApp } from './TestApp';

let context: ShellContextType;
let i18n: i18n;

export const setupTest = async (
  mockParams: GetLicenseHycuMocksParams & GetServicesMocksParams = {},
) => {
  (global.server as SetupServer)?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getLicenseHycuMocks(mockParams),
      ...getServicesMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext('hycu');
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
        screen.getAllByText('title', { exact: false }).length,
      ).toBeGreaterThan(0),
    { timeout: 30000 },
  );

  return result;
};
