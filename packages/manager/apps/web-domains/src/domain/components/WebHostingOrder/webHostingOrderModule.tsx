import { lazy, useEffect, useRef } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { Subsidiary } from '@ovh-ux/manager-config';
export interface WebHostingOptions {
  subsidiary: Subsidiary;
  language?: string;
  hostAppName?: string;
}

export interface ConfigoModuleFederationConfiguration {
  options: WebHostingOptions;
}

type WebHostingModuleFederationFactory = (
  slot: HTMLElement,
  moduleConfiguration: ConfigoModuleFederationConfiguration,
) => () => void;

export const WebHostingComponent = lazy(() =>
  loadRemote<{ default: WebHostingModuleFederationFactory }>(
    'react-order/webhosting',
  ).then((module) => {
    if (!module) {
      throw new Error('Failed to load WebHosting module from react-order');
    }
    let factoryFunction = module.default || module;
    if (typeof factoryFunction === 'object' && factoryFunction.default) {
      factoryFunction = factoryFunction.default;
    }

    return {
      default: ({ subsidiary, language, hostAppName }: WebHostingOptions) => {
        const containerRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
          const container = containerRef.current;
          if (!container || !subsidiary) {
            return undefined;
          }

          const configuration: ConfigoModuleFederationConfiguration = {
            options: {
              subsidiary,
              language,
              hostAppName,
            },
          };

          const cleanup = (factoryFunction as WebHostingModuleFederationFactory)(
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
        }, [subsidiary, language]);

        return <div ref={containerRef} className="max-w-7xl" />;
      },
    };
  }),
);
