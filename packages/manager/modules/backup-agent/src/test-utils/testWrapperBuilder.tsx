import React from 'react';

import { BackupAgentProviderProps } from '@/BackupAgent.context';

import {
  TestProvider,
  addAppContextProvider,
  addI18nextProvider,
  addQueryClientProvider,
  addShellContextProvider,
  createProviderWrapper,
} from './testWrapperProviders';

type BuilderConfig = {
  withI18next: boolean;
  withQueryClient: boolean;
  withShellContext: boolean;
  withAppContext: boolean;
  appContext?: BackupAgentProviderProps;
};
type TestWrapperBuilder = {
  withI18next: () => TestWrapperBuilder;
  withQueryClient: () => TestWrapperBuilder;
  withShellContext: () => TestWrapperBuilder;
  withAppContext: (customAppContext?: BackupAgentProviderProps) => TestWrapperBuilder;
  build: () => Promise<React.FC<React.PropsWithChildren>>;
};
export const testWrapperBuilder = (): TestWrapperBuilder => {
  const config: BuilderConfig = {
    withI18next: false,
    withQueryClient: false,
    withShellContext: false,
    withAppContext: false,
  };
  const build = async (): Promise<React.FC<React.PropsWithChildren>> => {
    const providers: TestProvider[] = [];
    if (config.withI18next) await addI18nextProvider(providers);
    if (config.withQueryClient) addQueryClientProvider(providers);
    if (config.withShellContext) await addShellContextProvider(providers);
    if (config.withAppContext) addAppContextProvider(providers, config.appContext);
    return createProviderWrapper(providers);
  };
  const builder = {
    withI18next: () => {
      config.withI18next = true;
      return builder;
    },
    withQueryClient: () => {
      config.withQueryClient = true;
      return builder;
    },
    withShellContext: () => {
      config.withShellContext = true;
      return builder;
    },
    withAppContext: (customAppContext?: BackupAgentProviderProps) => {
      config.withAppContext = true;
      config.appContext = customAppContext;
      return builder;
    },
    build,
  };
  return builder;
};
