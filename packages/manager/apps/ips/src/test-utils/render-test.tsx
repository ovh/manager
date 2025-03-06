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
  initTestI18n,
  getAuthenticationMocks,
  toMswHandlers,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { translations, labels } from './test-i18n';
import { TestApp } from './TestApp';
import {
  GetIpsMocksParams,
  getIpsMocks,
  GetDedicatedMocksParams,
  getDedicatedMocks,
  getCatalogMocks,
  getDedicatedCloudMocks,
  GetDedicatedCloudMocksParams,
  getDedicatedServerMocks,
  GetDedicatedServerMocksParams,
  getVrackMocks,
  GetVrackMocksParams,
  getVpsMocks,
  GetVpsMocksParams,
  getOrganisationMocks,
  GetOrganisationMocksParams,
  getIamMocks,
  GetIamMocksParams,
} from '../../mocks';

const APP_NAME = 'ips';

let context: ShellContextType;
let i18nState: i18n;

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetIpsMocksParams &
  GetIamMocksParams &
  GetDedicatedMocksParams &
  GetServicesMocksParams &
  GetDedicatedCloudMocksParams &
  GetDedicatedServerMocksParams &
  GetVrackMocksParams &
  GetVpsMocksParams &
  GetOrganisationMocksParams = {}) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getIpsMocks(mockParams),
      ...getIamMocks(mockParams),
      ...getDedicatedMocks(mockParams),
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getServicesMocks(mockParams),
      ...getCatalogMocks(),
      ...getDedicatedCloudMocks(mockParams),
      ...getDedicatedServerMocks(mockParams),
      ...getVrackMocks(mockParams),
      ...getVpsMocks(mockParams),
      ...getOrganisationMocks(mockParams),
    ]),
  );

  if (!context) {
    context = await initShellContext(APP_NAME);
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

  if (!initialRoute || initialRoute === '/ip') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(labels.listing.title, {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  }

  return result;
};
