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
  toMswHandlers,
  initTestI18n,
  getAuthenticationMocks,
} from '@ovh-ux/manager-core-test-utils';
import { SetupServer } from 'msw/lib/node';
import { TestApp } from './TestApp';
import { labels, translations } from './labels';
import {
  GetIamTagsMockParams,
  getIamTagsMocks,
} from '@/mocks/iam-tags/iam-tags.handler';
import { APP_NAME } from '../tracking.constant';
import { getIamReferenceResourceTypeMock } from '@/mocks/iam-resource/iam-tags.handler';

let context: ShellContextType;
let i18nValue: i18n;

export const renderTestApp = async (
  initialRoute = '/',
  mockParams: GetIamTagsMockParams = {},
) => {
  ((global as unknown) as { server: SetupServer }).server?.resetHandlers(
    ...toMswHandlers([
      ...getAuthenticationMocks({ isAuthMocked: true }),
      ...getIamTagsMocks(mockParams),
      ...getIamReferenceResourceTypeMock(),
    ]),
  );

  if (!context) {
    context = await initShellContext(APP_NAME);
  }

  if (!i18nValue) {
    i18nValue = await initTestI18n(APP_NAME, translations);
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
          screen.getAllByText(labels.tagManager.title, { exact: false }).length,
        ).toBeGreaterThan(0),
      { timeout: 30000 },
    );
  }

  return result;
};
