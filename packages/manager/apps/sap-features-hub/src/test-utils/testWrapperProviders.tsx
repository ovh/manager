import React from 'react';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  initShellContext,
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { initTestI18n } from './test-i18n';
import { APP_NAME } from '@/tracking.constants';

export type TestProvider = (props: React.PropsWithChildren) => React.ReactNode;

let context: ShellContextType;
let i18nState: i18n;

export const createProviderWrapper = (
  providers: TestProvider[],
): React.FC<React.PropsWithChildren> => {
  return ({ children }) =>
    providers.reduceRight((acc, provider) => {
      const ProviderComponent = provider;
      return <ProviderComponent>{acc}</ProviderComponent>;
    }, children);
};

export const addI18nextProvider = async (providers: TestProvider[]) => {
  if (!i18nState) {
    i18nState = await initTestI18n();
  }
  providers.push(({ children }) => (
    <I18nextProvider i18n={i18nState}>{children}</I18nextProvider>
  ));
};

export const addQueryClientProvider = (providers: TestProvider[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  providers.push(({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ));
};

export const addShellContextProvider = async (providers: TestProvider[]) => {
  if (!context) {
    context = await initShellContext(APP_NAME);
  }
  providers.push(({ children }) => (
    <ShellContext.Provider value={context}>{children}</ShellContext.Provider>
  ));
};
