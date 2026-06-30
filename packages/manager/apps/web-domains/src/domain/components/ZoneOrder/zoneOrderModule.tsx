import { lazy, useEffect, useRef } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { Subsidiary } from '@ovh-ux/manager-config';

export interface ZoneOptions {
  subsidiary: Subsidiary;
  language?: string;
  hostAppName?: string;
  /** Domain typed by the host — prefills the configo and renders it read-only. */
  zoneName: string;
  /**
   * Whether DNSSEC is supported for the domain. The configo compares this to
   * the string `'true'`, so it must be passed as a string, not a boolean.
   */
  dnssecSupported?: 'true' | 'false';
}

interface ZoneModuleFederationConfiguration {
  options: {
    subsidiary: Subsidiary;
    language?: string;
    hostAppName?: string;
  };
  selection: {
    zoneName?: string;
    dnssecSupported?: 'true' | 'false';
  };
}

type ZoneModuleFederationFactory = (
  slot: HTMLElement,
  moduleConfiguration: ZoneModuleFederationConfiguration,
) => () => void;

export const ZoneComponent = lazy(() =>
  loadRemote<{ default: ZoneModuleFederationFactory }>('react-order/zone').then(
    (module) => {
      if (!module) {
        throw new Error('Failed to load Zone module from react-order');
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
          zoneName,
          dnssecSupported,
        }: ZoneOptions) => {
          const containerRef = useRef<HTMLDivElement>(null);
          useEffect(() => {
            const container = containerRef.current;
            if (!container || !subsidiary) {
              return undefined;
            }

            const configuration: ZoneModuleFederationConfiguration = {
              options: {
                subsidiary,
                language,
                hostAppName,
              },
              selection: {
                zoneName,
                dnssecSupported,
              },
            };

            const cleanup = (factoryFunction as ZoneModuleFederationFactory)(
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
          }, [subsidiary, language, zoneName, dnssecSupported]);

          return <div ref={containerRef} className="max-w-7xl" />;
        },
      };
    },
  ),
);
