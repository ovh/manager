import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { init, loadRemote } from '@module-federation/runtime';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Spinner } from '@ovhcloud/ods-react';
import { PREFIX_TRACKING_ORDER } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';

// Type for the ConfigoNasHa module
interface ConfigoNasHaModule {
  default: (
    element: HTMLElement,
    config: {
      options: {
        assets: { flagsPath: string };
        language: string;
        subsidiary: string;
        express: { backUrl: string };
        navbar: { enable: boolean; backUrl: string };
        cart: { enable: boolean };
      };
      callbacks: {
        error: () => void;
        ready: () => void;
        update: () => void;
        navigation: (event: { action: string }) => void;
      };
      parameters: null;
      selections: null;
    },
  ) => void;
}

export default function OrderPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { shell, environment } = useContext(ShellContext);
  const { tracking, navigation } = shell;

  useEffect(() => {
    const setupOrder = async () => {
      if (!containerRef.current) return;

      const user = environment?.getUser();
      const userLocale = environment?.getUserLocale() || 'en_GB';
      const ovhSubsidiary = user?.ovhSubsidiary || 'GB';

      // Get the NASHA public URL for navigation
      const nashaPublicUrl = await navigation?.getURL('dedicated', '#/nasha');
      const nashaRoot = nashaPublicUrl || '#/nasha';

      // Initialize Module Federation
      init({
        remotes: [
          {
            name: '@order/ConfigoNasHa',
            alias: 'order_fm',
            type: 'module',
            entry: 'https://www.ovhcloud.com/order/configos/assets/remoteEntry.js',
          },
        ],
      });

      try {
        // Load the remote module
        const module = (await loadRemote('order_fm/ConfigoNasHa')) as ConfigoNasHaModule;

        if (module?.default && containerRef.current) {
          module.default(containerRef.current, {
            options: {
              assets: {
                flagsPath: '/assets/flags',
              },
              language: userLocale,
              subsidiary: ovhSubsidiary,
              express: {
                backUrl: nashaPublicUrl || '',
              },
              navbar: {
                enable: true,
                backUrl: nashaRoot,
              },
              cart: {
                enable: true,
              },
            },
            callbacks: {
              error: () => {
                console.error('Order component error');
              },
              ready: () => {
                console.log('Order component ready');
              },
              update: () => {
                console.log('Order component updated');
              },
              navigation: (event) => {
                switch (event.action) {
                  case 'order':
                    tracking?.trackClick({
                      name: `${PREFIX_TRACKING_ORDER}::confirm`,
                      type: 'action',
                    });
                    navigate(urls.listing);
                    break;
                  case 'leave':
                    tracking?.trackClick({
                      name: `${PREFIX_TRACKING_ORDER}::cancel`,
                      type: 'action',
                    });
                    break;
                  default:
                    break;
                }
              },
            },
            parameters: null,
            selections: null,
          });
        }
      } catch (error) {
        console.error('Failed to load order component:', error);
      }
    };

    setupOrder();
  }, [environment, navigation, tracking, navigate]);

  return (
    <div id="nasha-order" className="min-h-screen">
      <div
        ref={containerRef}
        id="nasha-order-container"
        className="box-border"
      >
        {/* Loading state while module loads */}
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </div>
    </div>
  );
}

