import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { init, loadRemote } from '@module-federation/runtime';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';

export default function OrderPage() {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const [ConfigoNasHaComponent, setConfigoNasHaComponent] = useState<React.ComponentType | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize Module Federation and load the remote component
    const loadOrderComponent = async () => {
      try {
        // Track page load
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: [APP_NAME, 'order', 'load'],
        });

        // Initialize Module Federation runtime
        init({
          name: '@ovh-ux/manager-bmc-nasha-app',
          remotes: [
            {
              name: '@order/ConfigoNasHa',
              alias: 'order_fm',
              type: 'module',
              entry: 'https://www.ovhcloud.com/order/configos/assets/remoteEntry.js',
            },
          ],
        });

        // Load the remote component
        const component = await loadRemote<{ default: React.ComponentType } | React.ComponentType>(
          'order_fm/ConfigoNasHa',
        );
        setConfigoNasHaComponent(
          () =>
            (component && typeof component === 'object' && 'default' in component
              ? component.default
              : component) as React.ComponentType,
        );
      } catch (err) {
        console.error('Failed to load order component:', err);
        setError(err instanceof Error ? err : new Error('Failed to load order component'));
      }
    };

    void loadOrderComponent();
  }, [trackClick]);

  const handleGoBack = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [APP_NAME, 'order', 'back'],
    });
    navigate('/listing');
  };

  if (error) {
    return (
      <BaseLayout header={{ title: t('common:order', 'Order') }}>
        <div className="p-4">
          <div className="mb-4 text-red-600">
            {t('common:error_loading_order', 'Error loading order component')}
          </div>
          <button type="button" onClick={handleGoBack} className="text-blue-600 hover:underline">
            {t('common:back_to_listing', 'Back to listing')}
          </button>
        </div>
      </BaseLayout>
    );
  }

  if (!ConfigoNasHaComponent) {
    return (
      <BaseLayout header={{ title: t('common:order', 'Order') }}>
        <div className="p-4">{t('common:loading', 'Loading...')}</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout header={{ title: t('common:order', 'Order') }}>
      <ConfigoNasHaComponent />
    </BaseLayout>
  );
}
