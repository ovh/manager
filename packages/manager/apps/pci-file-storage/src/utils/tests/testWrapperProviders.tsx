import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  ShellContext,
  ShellContextType,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';

export type TestProvider = (props: React.PropsWithChildren) => React.ReactNode;

let context: ShellContextType;

export const createProviderWrapper = (
  providers: TestProvider[],
): React.FC<React.PropsWithChildren> => {
  return ({ children }) =>
    providers.reduceRight((acc, provider) => {
      const ProviderComponent = provider;
      return <ProviderComponent>{acc}</ProviderComponent>;
    }, children);
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
    context = await initShellContext(appName);
  }
  providers.push(({ children }) => (
    <ShellContext.Provider value={context}>{children}</ShellContext.Provider>
  ));
};
