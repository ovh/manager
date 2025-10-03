import { ApplicationProviderOptions } from "./application-provider.type";
import { TestWrapperFactory } from "./context-wrapper.factory";

export type GetComponentWrapperParams = {
  withQueryClientProvider?: boolean;
  configuration?: ApplicationProviderOptions;
};

export const getComponentWrapper = ({
  withQueryClientProvider,
  configuration,
}: GetComponentWrapperParams) => {

  const wrapperFactory = new TestWrapperFactory();
  if (withQueryClientProvider) {
    wrapperFactory.withQueryClientProvider();
  }
  if (configuration) {
    wrapperFactory.withApplicationProvider(configuration);
  }

  return wrapperFactory.build();
};