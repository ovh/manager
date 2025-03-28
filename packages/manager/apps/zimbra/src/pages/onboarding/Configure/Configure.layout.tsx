import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useGenerateUrl, usePlatform } from '@/hooks';
import { setOnboarded } from '@/utils';
import Loading from '@/components/Loading/Loading';

export const ConfigureLayout: React.FC = () => {
  const { notifications } = useNotifications();
  const { t } = useTranslation(['onboarding']);
  const { platformId } = usePlatform();
  const backLink = useGenerateUrl(`/${platformId}`, 'href');

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        header={{
          title: 'Zimbra',
        }}
        subtitle={t('configure_title')}
        message={
          // temporary fix margin even if empty
          notifications.length ? <Notifications /> : null
        }
        backLinkLabel={t('configure_exit')}
        hrefPrevious={backLink}
        onClickReturn={() => setOnboarded()}
      >
        <Outlet />
      </BaseLayout>
    </Suspense>
  );
};

export default ConfigureLayout;
