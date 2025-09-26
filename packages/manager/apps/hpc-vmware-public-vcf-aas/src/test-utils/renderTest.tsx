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
  getVeeamBackupMocks,
  getOrganizationMocks,
  GetOrganizationMocksParams,
  getDatacentresMocks,
  GetDatacentresMocksParams,
  getDatacentreOrderMocks,
  GetDatacentreOrderMocksParams,
  GetVeeamBackupMocksParams,
  getIamMocks,
  getVrackSegmentsMocks,
  GetVrackSegmentsMocksParams,
} from '@ovh-ux/manager-module-vcd-api';
import {
  initTestI18n,
  getAuthenticationMocks,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { translations } from './test-i18n';
import { TestApp } from './TestApp';
import { APP_NAME } from '@/tracking.constants';
import {
  getFeatureAvailabilityMocks,
  TFeatureAvailabilityMockParams,
} from '@/mocks/feature-availability';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '@/utils/label.constants';
import { urls } from '@/routes/routes.constant';

let context: ShellContextType;
let i18nState: i18n;

const formatSafePath = (url: string) =>
  url && url.startsWith(urls.root) ? url : `${urls.root}${url ?? ''}`;
function testAppBuilder() {
  const providers: ((props: React.PropsWithChildren) => React.ReactNode)[] = [];

  return {
    async withI18nextProvider() {
      if (!i18nState) {
        i18nState = await initTestI18n(APP_NAME, translations);
      }

      providers.push(({ children }: React.PropsWithChildren) => (
        <I18nextProvider i18n={i18nState}>{children}</I18nextProvider>
      ));

      return this;
    },
    withQueryClientProvider() {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      providers.push(({ children }: React.PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ));

      return this;
    },
    async withShellProvider() {
      if (!context) {
        context = await initShellContext(APP_NAME);
      }

      providers.push(({ children }: React.PropsWithChildren) => (
        <ShellContext.Provider value={context}>
          {children}
        </ShellContext.Provider>
      ));

      return this;
    },
    renderApp({ children }: React.PropsWithChildren) {
      return render(
        providers.reduce(
          (child, parentsProviders) => parentsProviders({ children: child }),
          children,
        ),
      );
    },
  };
}

export const renderTest = async ({
  initialRoute,
  ...mockParams
}: {
  initialRoute?: string;
} & GetOrganizationMocksParams &
  GetDatacentresMocksParams &
  GetDatacentreOrderMocksParams &
  GetVeeamBackupMocksParams &
  TFeatureAvailabilityMockParams &
  GetVrackSegmentsMocksParams &
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
      ...getVrackSegmentsMocks(mockParams),
      ...getFeatureAvailabilityMocks(mockParams),
    ]),
  );

  const i18nextProviderStep = await testAppBuilder()
    .withQueryClientProvider()
    .withI18nextProvider();
  const shellProviderStep = await i18nextProviderStep.withShellProvider();
  const result = shellProviderStep.renderApp({
    children: <TestApp initialRoute={formatSafePath(initialRoute)} />,
  });

  if (!initialRoute || initialRoute === '/') {
    await waitFor(
      () =>
        expect(
          screen.getAllByText(VMWARE_CLOUD_DIRECTOR_LABEL, {
            exact: false,
          }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
