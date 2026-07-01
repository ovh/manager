import { lazy, useEffect, useRef } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { Subsidiary } from '@ovh-ux/manager-config';

export interface AnycastOptions {
  subsidiary: Subsidiary;
  language?: string;
  hostAppName?: string;
  /** Zone to activate (subscribe) or upgrade — rendered read-only by the configo. */
  zoneName: string;
  /**
   * Whether DNSSEC is supported for the domain. Only used by the subscribe
   * funnel (ignored on upgrade). Compared to the string `'true'` by the configo.
   */
  dnssecSupported?: 'true' | 'false';
  /**
   * Navbar config forwarded to the configo. `backUrl` drives the "Return" and
   * post-submit "Finish" buttons: the MFE navigates `window.location.href = backUrl`.
   */
  navbar?: { backUrl?: string };
}

interface AnycastModuleFederationConfiguration {
  options: {
    subsidiary: Subsidiary;
    language?: string;
    hostAppName?: string;
    navbar?: { backUrl?: string };
  };
  selection: {
    zoneName?: string;
    dnssecSupported?: 'true' | 'false';
  };
}

type AnycastModuleFederationFactory = (
  slot: HTMLElement,
  moduleConfiguration: AnycastModuleFederationConfiguration,
) => () => void;

/**
 * Build a lazy React component mounting an Anycast configo remote. The flow
 * (subscribe vs upgrade) is decided by which remote is loaded — the remote's
 * federation entry injects `needZoneActivation` itself, so the host only picks
 * the entry: `react-order/anycast` (subscribe) or `react-order/anycast_upgrade`.
 */
const createAnycastComponent = (
  remote: 'react-order/anycast' | 'react-order/anycast_upgrade',
) =>
  lazy(() =>
    loadRemote<{ default: AnycastModuleFederationFactory }>(remote).then(
      (module) => {
        if (!module) {
          throw new Error(`Failed to load Anycast module from ${remote}`);
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
            navbar,
          }: AnycastOptions) => {
            const containerRef = useRef<HTMLDivElement>(null);
            useEffect(() => {
              const container = containerRef.current;
              if (!container || !subsidiary) {
                return undefined;
              }

              const configuration: AnycastModuleFederationConfiguration = {
                options: {
                  subsidiary,
                  language,
                  hostAppName,
                  navbar,
                },
                selection: {
                  zoneName,
                  dnssecSupported,
                },
              };

              const cleanup = (factoryFunction as AnycastModuleFederationFactory)(
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

/** Subscribe funnel: activate a new DNS zone together with Anycast. */
export const AnycastSubscribeComponent = createAnycastComponent(
  'react-order/anycast',
);

/** Upgrade funnel: add Anycast to a DNS zone the customer already owns. */
export const AnycastUpgradeComponent = createAnycastComponent(
  'react-order/anycast_upgrade',
);
