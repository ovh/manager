import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Environment } from "@ovh-ux/manager-config";
import { initShell, Shell } from "@ovh-ux/shell";

import { ApplicationProvider } from "@/context";
import { BaseContextFactory } from "@/utils/tests/base-context.factory";

export class TestWrapperFactory extends BaseContextFactory {

  build() {
    return (component: JSX.Element) => {
      let composition = component;
      if (this.hasClientProvider) {
        composition = <QueryClientProvider client={new QueryClient()}>{composition}</QueryClientProvider>;
      }
      if (this.hasApplicationProvider) {
        const shellEnvironment = new Environment();
        shellEnvironment.setRegion(this.configuration.region);
        shellEnvironment.setUser(this.configuration.user);
        shellEnvironment.setApplicationURLs(this.configuration.applicationURLs);
        shellEnvironment.setUniverse(this.configuration.universe || '');
        shellEnvironment.setMessage(this.configuration.message);
        shellEnvironment.setApplications(this.configuration.applications);
        const shell: Shell = initShell(shellEnvironment);
        const environment: Environment = shell?.getPlugin('environment').getEnvironment() ?? null;
        composition = <ApplicationProvider environment={environment} shell={shell}>{composition}</ApplicationProvider>;
      }
      return composition;
    };
  }
};
