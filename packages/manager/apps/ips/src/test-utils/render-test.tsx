import { RenderResult, render, screen, waitFor } from '@testing-library/react';
import { SetupServer } from 'msw/node';
import { I18nextProvider, I18nextProviderProps } from 'react-i18next';
import { expect } from 'vitest';

import { Subsidiary } from '@ovh-ux/manager-config';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getAuthenticationMocks,
  initTestI18n,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import {
  GetServicesMocksParams,
  getServicesMocks,
} from '@ovh-ux/manager-module-common-api';
import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import {
  GetCatalogMocksParams,
  GetDedicatedCloudMocksParams,
  GetDedicatedMocksParams,
  GetDedicatedServerMocksParams,
  GetIpLoadBalancingMocksParams,
  GetIpsMocksParams,
  GetOrganisationMocksParams,
  GetVpsMocksParams,
  GetVrackMocksParams,
  getCatalogMocks,
  getCloudProjectMocks,
  getDedicatedCloudMocks,
  getDedicatedMocks,
  getDedicatedServerMocks,
  getIpLoadBalancingMocks,
  getIpsMocks,
  getOrganisationMocks,
  getIamMocks,
  getOverTheBoxMocks,
  getVpsMocks,
  getVrackMocks,
  getXdslMocks,
} from '@/__mocks__';

import { TestApp } from './TestApp';
import { labels, translations } from './test-i18n';

export type GetUserMocksParams = {
  ovhSubsidiary?: Subsidiary;
};

export type MockParams = GetIpsMocksParams &
  GetDedicatedMocksParams &
  GetServicesMocksParams &
  GetDedicatedCloudMocksParams &
  GetDedicatedServerMocksParams &
  GetVrackMocksParams &
  GetVpsMocksParams &
  GetOrganisationMocksParams &
  GetCatalogMocksParams &
  GetIpLoadBalancingMocksParams &
  GetUserMocksParams;

const APP_NAME = 'ips';

let context: ShellContextType;
let i18nState: I18nextProviderProps['i18n'];

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: { initialRoute?: string } & MockParams = {}): Promise<RenderResult> => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers(
      [
        ...getIpsMocks(mockParams),
        ...getDedicatedMocks(mockParams),
        ...getAuthenticationMocks({ isAuthMocked: true }),
        ...getServicesMocks(mockParams),
        ...getCatalogMocks(mockParams),
        ...getDedicatedCloudMocks(mockParams),
        ...getDedicatedServerMocks(mockParams),
        ...getVrackMocks(mockParams),
        ...getVpsMocks(mockParams),
        ...getOrganisationMocks(mockParams),
        ...getCloudProjectMocks(),
        ...getIpLoadBalancingMocks(mockParams),
        ...getXdslMocks(),
        ...getOverTheBoxMocks(),
        ...getIamMocks(),
      ].map((handler) => ({
        ...handler,
        // TODO: Remove when toMswHandlers has default delay 0
        delay: 0,
      })),
    ),
  );

  if (!context) {
    context = (await initShellContext(APP_NAME)) as ShellContextType;
  }

  context.environment.getUser().ovhSubsidiary =
    mockParams.ovhSubsidiary ?? 'FR';

  if (!i18nState) {
    i18nState = (await initTestI18n(
      APP_NAME,
      translations,
    )) as I18nextProviderProps['i18n'];
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
