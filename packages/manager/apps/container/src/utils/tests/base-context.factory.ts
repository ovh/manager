import { ConfigurationMock } from "@/__mocks__/shell/configuration.mock";
import { Configuration } from "@/types/configuration";
import { ApplicationProviderOptions } from "@/utils/tests/application-provider.type";

export abstract class BaseContextFactory {
  hasClientProvider: boolean = false;
  hasApplicationProvider: boolean = false;
  configuration: Configuration | null = null;

  withQueryClientProvider() {
    this.hasClientProvider = true;
    return this;
  };

  withApplicationProvider(applicationProviderOptions: ApplicationProviderOptions = {}) {
    this.hasApplicationProvider = true;
    this.configuration = {
      applications: {
        ...ConfigurationMock.applications,
        ...applicationProviderOptions.applications,
      },
      region: applicationProviderOptions.region || ConfigurationMock.region,
      universe: applicationProviderOptions.universe || ConfigurationMock.universe,
      message: {
        ...ConfigurationMock.message,
        ...applicationProviderOptions.message,
      },
      user: {
        ...ConfigurationMock.user,
        ...applicationProviderOptions.user,
      },
      applicationURLs: {
        ...ConfigurationMock.applicationURLs,
        ...applicationProviderOptions.applicationURLs,
      },
    }
    return this;
  };
}
