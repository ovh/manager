import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import { BackupAgentContext, BackupAgentProviderProps } from '@/BackupAgent.context';

import { initTestI18n } from './i18ntest.utils';

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
  providers.push(({ children }) => <I18nextProvider i18n={i18nState}>{children}</I18nextProvider>);
};
export const createQueryClientTest = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } },
  });

export const addQueryClientProvider = (
  providers: TestProvider[],
  customQueryClient?: QueryClient,
) => {
  const queryClient = customQueryClient ?? createQueryClientTest();
  providers.push(({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ));
};
export const addShellContextProvider = async (providers: TestProvider[]) => {
  if (!context) {
    context = await initShellContext('no-app');
  }
  providers.push(({ children }) => (
    <ShellContext.Provider value={context}>{children}</ShellContext.Provider>
  ));
};

export const addAppContextProvider = (
  providers: TestProvider[],
  appContext?: BackupAgentProviderProps,
) => {
  const backupAgentContext = appContext ?? { appName: 'backup-agent', scope: 'Enterprise' };

  providers.push(({ children }) => (
    <BackupAgentContext.Provider value={backupAgentContext}>{children}</BackupAgentContext.Provider>
  ));
};
