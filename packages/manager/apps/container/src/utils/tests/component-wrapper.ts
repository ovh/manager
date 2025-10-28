import { ApplicationProviderOptions } from "./application-provider.type";
import { TestWrapperFactory } from "./context-wrapper.factory";

export type GetComponentWrapperParams = {
  withQueryClientProvider?: boolean;
  withPreloaderProvider?: boolean;
  configuration?: ApplicationProviderOptions;
};

export const getComponentWrapper = ({
  withQueryClientProvider,
  withPreloaderProvider,
  configuration,
}: GetComponentWrapperParams) => {

  const wrapperFactory = new TestWrapperFactory();
  if (withQueryClientProvider) {
    wrapperFactory.withQueryClientProvider();
  }
  if (configuration) {
    wrapperFactory.withApplicationProvider(configuration);
  }
  if (withPreloaderProvider) {
    wrapperFactory.withPreloaderProvider();
  }

  return wrapperFactory.build();
};