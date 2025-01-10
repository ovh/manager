import React from 'react';
import { SetupServer } from 'msw/node';
import {
  initShellContext,
  ShellContextType,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { toMswHandlers, initTestI18n } from '@ovh-ux/manager-core-test-utils';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { render, waitFor, screen } from '@testing-library/react';
import { APP_NAME } from '@/tracking.constant';
import { translations } from './test-i18n';
import { TestApp } from './TestApp';
import {
  getInstallationServiceMocks,
  GetInstallationServiceMocksParams,
} from '@/mocks/vmwareServices/vmwareServices.handler';

let context: ShellContextType;
let i18nState: i18n;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetInstallationServiceMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([...getInstallationServiceMocks(mockParams)]),
  );

  if (!context) {
    context = await initShellContext('sap');
  }

  if (!i18nState) {
    i18nState = await initTestI18n(APP_NAME, translations);
  }

  const result = render(
    <I18nextProvider i18n={i18nState}>
      <ShellContext.Provider value={context}>
        <TestApp initialRoute={initialRoute} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(APP_NAME, { exact: false }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
