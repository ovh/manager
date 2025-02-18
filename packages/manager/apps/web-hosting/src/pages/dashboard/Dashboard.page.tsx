import React, { useMemo } from 'react';
import {
  Outlet,
  useResolvedPath,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
  GuideButton,
  GuideItem,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import TabsPanel, {
  computePathMatchers,
  TabItemProps,
} from '@/components/tabsPanel/TabsPanel.component';
import { urls } from '@/routes/routes.constants';
import { GENERAL_INFORMATIONS } from '@/tracking.constants';
import { useUrl } from '@/hooks/url/useUrl';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';

export const DashboardLayout: React.FC = () => {
  const { trackClick } = useOvhTracking();
  const { serviceName } = useParams();
  const { notifications } = useNotifications();
  const { t } = useTranslation('common');
  const basePath = useResolvedPath('').pathname;

  const guides: GuideItem[] = [
    {
      id: 1,
      href: 'test',
      target: '_blank',
      label: t('test'),
      onClick: () => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.externalLink,
          actionType: 'navigation',
          actions: [],
        });
      },
    },
  ];

  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(Array.from(searchParams.entries()));
  }, [searchParams]);

  const tabsList: TabItemProps[] = [
    {
      name: 'general_informations',
      tracking: GENERAL_INFORMATIONS,
      title: t('general_informations'),
      to: useUrl(basePath, params),
      pathMatchers: computePathMatchers([urls.dashboard], serviceName),
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: 'Web hosting',
        headerButton: <GuideButton items={guides} />,
      }}
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications /> : null
      }
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
};

export default DashboardLayout;
