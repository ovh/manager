import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { i18n } from 'i18next';
import { SetupServer } from 'msw/node';
import { I18nextProvider } from 'react-i18next';
import { expect } from 'vitest';

import {
  getAuthenticationMocks,
  initTestI18n,
  toMswHandlers,
} from '@ovh-ux/manager-core-test-utils';
import { GetServicesMocksParams, getServicesMocks } from '@ovh-ux/manager-module-common-api';
import {
  GetDatacentreOrderMocksParams,
  GetDatacentresMocksParams,
  GetNetworkAclMocksParams,
  GetOrganizationMocksParams,
  GetVeeamBackupMocksParams,
  GetVrackSegmentsMocksParams,
  getDatacentreOrderMocks,
  getDatacentresMocks,
  getIamMocks,
  getNetworkAclMock,
  getOrganizationMocks,
  getVeeamBackupMocks,
  getVrackSegmentsMocks,
} from '@ovh-ux/manager-module-vcd-api';
import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import {
  TFeatureAvailabilityMockParams,
  getFeatureAvailabilityMocks,
} from '@/mocks/feature-availability';
import { urls } from '@/routes/routes.constant';
import { APP_NAME } from '@/tracking.constants';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '@/utils/label.constants';

import { TestApp } from './TestApp';
import { translations } from './test-i18n';

let context: ShellContextType;
let i18nState: i18n;

const formatSafePath = (url: string) =>
  url && url.startsWith(urls.root) ? url : `${urls.root}${url ?? ''}`;

export const renderTest = async ({
  initialRoute = '',
  ...mockParams
}: {
  initialRoute?: string;
} & GetOrganizationMocksParams &
  GetDatacentresMocksParams &
  GetDatacentreOrderMocksParams &
  GetVeeamBackupMocksParams &
  TFeatureAvailabilityMockParams &
  GetVrackSegmentsMocksParams &
  GetNetworkAclMocksParams &
  GetServicesMocksParams = {}) => {
  (global as unknown as { server: SetupServer }).server?.resetHandlers(
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
      ...getNetworkAclMock(mockParams),
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
        <TestApp initialRoute={formatSafePath(initialRoute)} />
      </ShellContext.Provider>
    </I18nextProvider>,
  );

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
