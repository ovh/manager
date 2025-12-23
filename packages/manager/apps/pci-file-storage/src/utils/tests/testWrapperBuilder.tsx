import React from 'react';

import {
  TestProvider,
  addQueryClientProvider,
  addShellContextProvider,
  createProviderWrapper,
} from './testWrapperProviders';

type BuilderConfig = {
  withQueryClient: boolean;
  withShellContext: boolean;
};

type TestWrapperBuilder = {
  withQueryClient: () => TestWrapperBuilder;
  withShellContext: () => TestWrapperBuilder;
  build: () => Promise<React.FC<React.PropsWithChildren>>;
};

export const testWrapperBuilder = (): TestWrapperBuilder => {
  const config: BuilderConfig = {
    withQueryClient: false,
    withShellContext: false,
  };
  const build = async (): Promise<React.FC<React.PropsWithChildren>> => {
    const providers: TestProvider[] = [];
    if (config.withQueryClient) addQueryClientProvider(providers);
    if (config.withShellContext) await addShellContextProvider(providers);
    return createProviderWrapper(providers);
  };
  const builder = {
    withQueryClient: () => {
      config.withQueryClient = true;
      return builder;
    },
    withShellContext: () => {
      config.withShellContext = true;
      return builder;
    },
    build,
  };
  return builder;
};
