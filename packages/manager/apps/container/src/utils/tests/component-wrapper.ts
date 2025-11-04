import { ApplicationProviderOptions } from "./application-provider.type";
import { TestWrapperFactory } from "./context-wrapper.factory";

export type GetComponentWrapperParams = {
  withQueryClientProvider?: boolean;
  withContainerProvider?: boolean;
  configuration?: ApplicationProviderOptions;
};

export const getComponentWrapper = ({
  withQueryClientProvider,
  withContainerProvider,
  configuration,
}: GetComponentWrapperParams) => {

  const wrapperFactory = new TestWrapperFactory();
  if (withQueryClientProvider) {
    wrapperFactory.withQueryClientProvider();
  }
  if (withContainerProvider) {
    wrapperFactory.withContainerProvider();
  }
  if (configuration) {
    wrapperFactory.withApplicationProvider(configuration);
  }

  return wrapperFactory.build();
};
