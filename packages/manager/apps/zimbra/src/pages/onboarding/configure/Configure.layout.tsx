import React, { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Notifications, useNotifications } from '@ovh-ux/muk';

import { Loading } from '@/components';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { EXIT, ONBOARDING_CONFIGURE } from '@/tracking.constants';

export const ConfigureLayout: React.FC = () => {
  const { trackClick } = useOvhTracking();
  const { notifications } = useNotifications();
  const { t } = useTranslation(['onboarding']);
  const { platformId } = usePlatform();
  const backLink = useGenerateUrl(`/${platformId}`, 'href');

  return (
    <BaseLayout
      header={{
        title: 'Zimbra',
      }}
      subtitle={t('configure_title')}
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications clearAfterRead /> : null
      }
      backLink={{
        label: t('configure_exit'),
        previousPageLink: backLink,
        onClick: () => {
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: [ONBOARDING_CONFIGURE, EXIT],
          });
        },
      }}
    >
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
};

export default ConfigureLayout;
