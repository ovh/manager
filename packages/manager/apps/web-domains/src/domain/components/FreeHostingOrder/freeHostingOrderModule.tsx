import { lazy, useEffect, useRef } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { Subsidiary } from '@ovh-ux/manager-config';

export interface FreeHostingConfigoOptions {
  subsidiary: Subsidiary;
  language?: string;
  /**
   * Must be `'manager'`: the configo only renders its tunnel when hosted by the
   * manager (auth + service resolution rely on it); otherwise it shows an error.
   */
  hostAppName?: string;
  /**
   * Domain the free hosting is activated for. Passed as `selection.serviceName`
   * (see the freehosting configo USAGE). Without it the configo renders a
   * blocking "Missing domain name" screen instead of the tunnel.
   */
  serviceName: string;
  /**
   * Navbar config forwarded to the configo. `backUrl` drives the back CTA the
   * configo can render: the MFE navigates `window.location.href = backUrl`.
   */
  navbar?: { backUrl?: string };
}

interface FreeHostingModuleFederationConfiguration {
  options: {
    subsidiary: Subsidiary;
    language?: string;
    hostAppName?: string;
    navbar?: { backUrl?: string };
  };
  selection: {
    serviceName?: string;
  };
}

type FreeHostingModuleFederationFactory = (
  slot: HTMLElement,
  moduleConfiguration: FreeHostingModuleFederationConfiguration,
) => () => void;

export const FreeHostingComponent = lazy(() =>
  loadRemote<{ default: FreeHostingModuleFederationFactory }>(
    'react-order/freehosting',
  ).then((module) => {
    if (!module) {
      throw new Error('Failed to load FreeHosting module from react-order');
    }
    let factoryFunction = module.default || module;
    if (typeof factoryFunction === 'object' && factoryFunction.default) {
      factoryFunction = factoryFunction.default;
    }

    return {
      default: ({
        subsidiary,
        language,
        hostAppName,
        serviceName,
        navbar,
      }: FreeHostingConfigoOptions) => {
        const containerRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
          const container = containerRef.current;
          if (!container || !subsidiary) {
            return undefined;
          }

          const configuration: FreeHostingModuleFederationConfiguration = {
            options: {
              subsidiary,
              language,
              hostAppName,
              navbar,
            },
            selection: {
              serviceName,
            },
          };

          const cleanup = (factoryFunction as FreeHostingModuleFederationFactory)(
            container,
            configuration,
          );

          return () => {
            if (cleanup && typeof cleanup === 'function') {
              cleanup();
            }
            if (container) {
              container.innerHTML = '';
            }
          };
        }, [subsidiary, language, serviceName]);

        return <div ref={containerRef} className="max-w-7xl" />;
      },
    };
  }),
);
